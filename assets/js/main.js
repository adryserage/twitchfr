(function($){	
	var twitchBox = {
		username: null,
		currentContentChannel: null,
		channels: {},
		current: {},
		clientID: '',
		scopes: [
			'user_read'
		],
		settings: {
			authenticated: false,
			offline: true,
			playlist: true,
			hosted: true,
			chat: true,
			switcher: false,
			switcherChannels: []
		},
		init: function(){
			this.cacheDom();
			this.bindEvents();
			this.getSettings();
			
			Twitch.init({clientId: this.clientID}, function(error, status) {

				if( this.getParameter('access_token') ){
					location.replace(location.origin+location.pathname);
    		}else if( status.authenticated ){
    			if( !this.settings.authenticated ){
    				this.settings.authenticated = true;
    				this.saveSettings();
    			}

    			this.getData('user');
    		}else if( !this.settings.authenticated ){
    			this.notify({
						cta: 'token',
						title: 'Connect with your Twitch account to access FullStream',
						message: 'FullStream requires limited access to your Twitch account, please press the button below to connect.',
						buttonText: 'Connect with Twitch'
					});
    		}else{
    			Twitch.login({ scope: this.scopes });
    		}

 			}.bind(this));

			setInterval(this.update.bind(this), 60000);
		},
		cacheDom: function(){
			this.$document = $(document);
			this.$body = this.$document.find('body');
			this.$statusBar = this.$document.find('#status-bar');
			this.$channelList = this.$document.find('#channel-list');
			this.$stream = this.$document.find('#stream');
			this.$pip = this.$document.find('#pip-stream');
			this.$chat = this.$document.find('#chat');
			this.$searchForm = this.$document.find('#content-search-form');
			this.$searchField = this.$document.find('#content-search-field');
			this.$searchOptions = this.$document.find('#content-search-options');
			this.$switcherChannels = this.$document.find('.switcher-channels');
			this.$availibleSwitcherChannels = this.$document.find('.availible-switcher-channels');
			this.$notification = this.$document.find('#notification');
			this.$loading = this.$document.find('#loading');
			this.$settings = this.$document.find('#settings');
			this.$account = this.$document.find('#user-account');
			this.$chatChannelToggle = this.$document.find('.cta-channels-chat');

			$.template( 'status-bar', this.$document.find('#status-bar-template').html() );
			$.template( 'content-title', this.$document.find('#content-title-template').html() );
			$.template( 'channel', this.$document.find('#channel-template').html() );
			$.template( 'account', this.$document.find('#account-template').html() );
			$.template( 'content-channel', this.$document.find('#content-channel-template').html() );
			$.template( 'panels', this.$document.find('#content-panels-template').html() );
			$.template( 'vod', this.$document.find('#content-vod-template').html() );
			$.template( 'game', this.$document.find('#content-game-template').html() );
			$.template( 'switcher-channel', this.$document.find('#switcher-channel-template').html() );
			$.template( 'notification', this.$document.find('#notification-template').html() );
		},
		bindEvents: function(){
			this.$body.on('click', '.media-trigger', this.changeChannel.bind(this));
			this.$body.on('click', '.content-trigger', this.changeContent.bind(this));
			this.$body.on('click', '.cta', this.ctaHandler.bind(this));
			this.$body.on('click', '.switcher-channel', this.switcherHandler.bind(this));
			this.$body.on('click', '.switcher-channel i', this.switcherHandler.bind(this));
			
			this.$searchField.on('keyup', this.searchContent.bind(this));
			this.$searchForm.on('submit', this.searchContent.bind(this));
			
			this.$searchOptions.on('change', this.searchContent.bind(this));
			this.$body.on('change', '.setting', this.settingChangeHandler.bind(this));
			
			this.$pip.draggable({ containment: 'parent' });
			this.$switcherChannels.sortable({
				containment: 'parent',
				tolerance: 'pointer',
				cursor: '-webkit-grabbing',
				update: this.sortSwitcher.bind(this)
			});
		},
		update: function(){
			if( this.getParameter('access_token') ){ location.reload(); }

			this.getData('follows');
		},
		sortChannels: function(){
			var sorted = [];
			for(x in arguments){
				if(arguments[x] == 'alphabetical'){
					for(y in this.channels){
						if(!this.channels[y].hosted){
							sorted[this.channels[y].name] = this.channels[y];
						}
					}
					sorted.sort();
				}else if(this.settings[arguments[x]] || arguments[x] == 'online'){
					var arr = [];
					for(y in this.channels){
						if(this.channels[y].type == arguments[x]){
							arr[arr.length] = this.channels[y];
						}
					}
					sorted = sorted.concat(arr);
				}
			}
			return sorted;
		},
		render: function(args){
			if(args){
				var $target = this.$document.find(args.targetElement),
						$title = $target.parent().find('.content-title h1');
				
				if(!args.keepContent){
					$target.empty();
				}
				
				switch(args.type){
					case 'live-channels':
						var types = ['online', 'playlist', 'hosted'];
						for(x in types){
							if(this.settings[types[x]] || types[x] == 'online'){
								$target.append( $.tmpl('content-title', {title: types[x]}) );
								$target.append( $.tmpl('content-channel', this.sortChannels(types[x])) );
							}
						}
						break;
					case 'games':
					case 'top-games':
						if(args.data.length > 0){
							$target.append( $.tmpl('content-title', {title: args.title}) );
							$target.append( $.tmpl('game', args.data) );
						}
						break;
					case 'search':
						$target.html( $.tmpl('content-channel', args.data) );
						break;
					case 'settings':
						for(var x=0; x < $target.length; x++){
							var id = $target[x].id.substring(8);
							
							if(this.settings[id]){
								$target[x].checked = true;
							}

							this.saveSettings();
						}
						break;
					default:
						$title.html(args.title);
						$target.append( $.tmpl(args.type, args.data) );
						break;
				}
			}else{
				this.$channelList.empty();
				$.tmpl('channel', this.sortChannels('online', 'playlist', 'hosted', 'offline')).appendTo(this.$channelList);

				if(this.channels[this.current.name] && !this.channels[this.current.name].hosted){
					this.current = this.channels[this.current.name];
				}

				if(this.current.name){
					this.$statusBar.html( $.tmpl('status-bar', this.current) );
				}

				// switcher channels
				var switcherArr = [],
						otherArr = [],
						follows = this.sortChannels('alphabetical');
				
				for(x in this.settings.switcherChannels){
					switcherArr[switcherArr.length] = this.channels[this.settings.switcherChannels[x]];
				}

				for(y in follows){
					if(this.settings.switcherChannels.indexOf(y) <= -1){
						otherArr[otherArr.length] = follows[y];
					}
				}

				this.$switcherChannels.html( $.tmpl('switcher-channel', {arr: switcherArr}));
				this.$availibleSwitcherChannels.html( $.tmpl('switcher-channel', {arr: otherArr}));
				
				this.render({
					type: 'live-channels',
					targetElement: '#content-live-channels'
				});
			}

			if(args && args.type != 'settings'){ this.$loading.hide(); }
		},
		getSettings: function(){
			if(localStorage.settings){
				var storedSettings = JSON.parse(localStorage.settings);
				
				for(key in storedSettings){
					if(key in this.settings){
						this.settings[key] = storedSettings[key];
					}
				}
			}
			
			this.render({
				type: 'settings',
				targetElement: '.setting'
			});
		},
		saveSettings: function(){
			localStorage.settings = JSON.stringify(this.settings);
		},
		settingChangeHandler: function(e){
			var $setting = $(e.target),
					id = $setting[0].id.substring(8),
					value = $setting[0].checked;

			this.settings[id] = value;
			this.saveSettings();

			if(!this.settings.chat){
				this.$chatChannelToggle.hide();
				this.$chat.attr('src', '');
				this.$body.removeClass('show-chat');
			}else if(id == 'chat' && this.current.name){
				this.changeEmbeds('chat');
				this.$chatChannelToggle.show();
			}

			this.render();
		},
		getEndpoint: function(args){
			switch(args.type){
				case 'user':
					return '/'+args.type;
					break;
				case 'follows':
					return '/users/'+this.username+'/follows/channels';
					break;
				case 'streams':
					return '/streams/followed';
					break;
				case 'hosted':
					return '/users/'+this.username+'/followed/hosting';
					break;
				case 'panels':
					return '/channels/'+args.targetChannel+'/panels';
					break;
				case 'highlights':
				case 'broadcasts':
					return '/channels/'+args.targetChannel+'/videos';
					break;
				case 'games': 
					return '/users/'+this.username+'/follows/games';
					break;
				case 'top-games':
					return '/games/top';
					break;
				case 'search':
					if(args.searchType == 'games'){
						return '/streams';
					}else{
						return '/search/streams';
					}
					break;
				case 'vod':
					return '/videos/'+args.videoId;
					break;
				case 'channel':
					if(args.offline || args.account){
						return '/channels/'+args.targetChannel;
					}else{
						return '/streams';
					}
					break;
			}
		},
		getData: function(args){
			switch(args.type){
				case 'panels':
				case 'highlights':
				case 'broadcasts':
				case 'games':
				case 'search':
					this.$loading.show();
					break;
			}

			if(typeof args != 'object'){ args = {type: args} }
			if(!args.params){ args.params = {}; }
			
			switch(args.type){
				case 'follows':
				case 'streams':
				case 'highlights':
				case 'broadcasts':
				case 'top-games':
				case 'search':
					if(!args.params.offset){ args.params.offset = 0; }
					args.params.limit = 100;
					break;
			}

			switch(args.type){
				case 'follows':
					args.params.sortby = 'login';
					args.params.direction = 'asc';
					break;
				case 'streams':
					args.params.stream_type = 'all';
					break;
				case 'broadcasts':
					args.params.broadcasts = true;
					break;
				case 'search':
					if(args.searchType == 'games'){
						args.params.game = args.searchTerm;
					}else{
						args.params.q = args.searchTerm;
					}
					break;
				case 'channel':
					args.params.channel= args.targetChannel;
					args.params.stream_type = 'all';
					break;
			}
			
			switch(args.type){
				case 'hosted':
				case 'panels':
				case 'games':
					var URI = 'https://api.twitch.tv/api/'+this.getEndpoint(args)+'?offset=0&limit=100&callback=?';

					$.getJSON(URI, function(data){
						switch(args.type){
							case 'hosted':
								for(x in data.hosts){
									var hostedChan = data.hosts[x]	
											id = hostedChan.target.channel.name,
											host = hostedChan.display_name;
									
									if(!this.channels[id]){
										this.channels[id] = Channel.create(hostedChan.target);
										this.channels[id].updateProperty('hosted', true);
										this.channels[id].updateProperty('host', host);
										this.channels[id].updateProperty('type', 'hosted');
										this.channels[id].updateProperty('game', hostedChan.target.meta_game);
										this.channels[id].updateProperty('status', hostedChan.target.title);
									}
								}
								this.render();
								break;
							case 'panels':
								this.render({
									title: this.currentContentChannel+'\'s '+args.type,
									type: args.type,
									targetElement: args.targetElement, 
									data: data
								});
								break;
							case 'games':
								var games = {
									targetElement: args.targetElement,
									type: args.type
								};
								
								games.title  = 'Followed games';
								games.data = Games.create(data.follows);	
								args.type = 'top-games';

								this.render(games);
								this.getData(args);	
								break;
						}
					}.bind(this))
					break;
				default:
					Twitch.api({ method: this.getEndpoint(args), params: args.params }, function(error, data){
						if(error){
							switch(args.type){
								case 'highlights':
								case 'broadcasts':
								case 'top-games':
								case 'search':
									this.notify({
										cta: 'error',
										title: 'An error occured',
										message: 'There was an issue with your request, please try again later',
										buttonText: 'OK'
									});
									break;
							}

						}else{
							switch(args.type){
								case 'user':
									this.username = data.name;
									this.currentContentChannel = this.username;
									this.$account.html( $.tmpl('account', data) );
									this.getData('follows');
									break;
								case 'follows':
									if(args.params.offset <= 0){ this.channels = {} }
									
									for(x in data.follows){
										this.channels[data.follows[x].channel.name] = Channel.create(data.follows[x]);
									}

									if(data.follows.length >= 100){
										args.params.offset += 100;
										this.getData(args);
									}else{
										this.getData('streams');
									}
									break;
								case 'streams':
									for(x in data.streams){
										var liveChan = data.streams[x],
												id = liveChan.channel.name;

										this.channels[id].update(liveChan)

										if(this.channels[id].is_playlist){
											this.channels[id].updateProperty('type', 'playlist');
											this.channels[id].updateProperty('game', 'playlist');
										}else{
											this.channels[id].updateProperty('live', true);
											this.channels[id].updateProperty('type', 'online');
										}
									}
									this.getData('hosted');
									this.switcher();
									break;
								case 'highlights':
								case 'broadcasts':
									var vodArr = [];

									for(x in data.videos){
										vodArr[vodArr.length] = Vod.create(data.videos[x]);
									}
									
									this.render({
										title: this.currentContentChannel+'\'s '+args.type,
										type: 'vod', 
										targetElement: args.targetElement, 
										data: vodArr
									});
									break;
								case 'top-games':
									var games = {
										targetElement: args.targetElement,
										type: args.type
									};
							
									games.title = 'Top games on twitch';
									games.keepContent = true;
									games.data = Games.create(data.top);
						
									this.render(games);
									break;
								case 'search':
									if(data.streams.length <= 0 && args.searchType == 'games'){
										this.getData({
											type: args.type,
											searchTerm: args.searchTerm,
											searchType: 'all'
										});
									}else{
										this.render({
											type: args.type,
											data: Channels.create(data.streams),
											targetElement: '#content-'+args.type,
										});
									}
									break;
								case 'vod':
									var vodArr = Vod.create(data);
									
									vodArr.display_name = data.channel.display_name;
									
									if(this.channels[data.channel.name]){
										vodArr.logo = this.channels[data.channel.name].logo;
									}

									this.render({type: 'status-bar', targetElement: this.$statusBar, data: vodArr});
									break;
								case 'channel':
									if(args.account){
										this.account = Channel.create(data);
										if(!this.currentContentChannel){
										}
									}else if(data.streams[0].viewers){
										this.current = Channel.create(data.streams[0]);
										this.currentContentChannel = this.current.name;
										this.render();
									}else{
										args.offline = true;
										this.getData(args);
									}
									break;
							}
						}
				}.bind(this));
				break;
			}
		},
		getParameter: function(paramName){
			params = location.hash.substring(1).split("&");
			
			for(var i=0; i < params.length; i++){
				val = params[i].split("=");
				if(val[0] == paramName){
					return val[1];
				}
			}
			return null;
		},
		changeChannel: function(e){
			var $target = $(e.currentTarget);
			
			if( $target.attr('data-fullstream-channel') ){
				var id = $target.attr('data-fullstream-channel');
				if(this.channels[id] && !this.channels[id].hosted){
					this.current = this.channels[id];
					this.currentContentChannel = this.current.name;
					this.changeEmbeds();
					this.render();
				}else{
					this.current.name = id;
					this.changeEmbeds();
					this.getData({
						type: 'channel',
						targetChannel: id
					})
				}
			}else if( $target.attr('data-fullstream-vod') ){
				var id = $target.attr('data-fullstream-vod');
				this.current = {};
				this.getData({type:'vod', videoId: id});
				this.changeEmbeds({videoId: id})
			}
		},
		changeEmbeds: function(args){
			var player = 'http://player.twitch.tv/?showInfo=false',
					flashPlayer = 'http://www.twitch.tv/widgets/live_embed_player.swf';
			if(typeof args == 'object'){
				if(args.pipId){
					this.$pip.find('iframe').attr('src', player+'&channel='+args.pipId);
					
					this.$body.addClass('show-pip')
				}else if(args.videoId){
					this.$chat.attr('src', '');
					
					this.$body.removeClass('show-chat');
					this.$body.removeClass('show-content');
					this.$chatChannelToggle.hide();

					if(args.videoId[0] == 'c'){
						this.$stream.attr('src', flashPlayer+'?videoId='+args.videoId);
					}else{
						this.$stream.attr('src', player+'&video='+args.videoId);
					}

				}
			}else{
				if(args != 'chat'){
					this.$stream.attr('src', player+'&channel='+this.current.name);
					this.$body.removeClass('show-content');
				}
				this.$chat.attr('src', 'http://twitch.tv/chat/embed?channel='+this.current.name);
				if(this.settings.chat){ this.$chatChannelToggle.show(); }
			}	
		},
		changeContent: function(e){
			var $target = $(e.currentTarget),
					type = $target.attr('data-fullstream-content-type'),
					channel = $target.parent().attr('data-fullstream-channel'),
					game = $target.attr('data-fullstream-game'),
					tab = this.$body.find('#tab-'+type);
			
			if(!tab[0].checked){
				tab[0].checked = true;
			}
			
			this.$body.addClass('show-content');

			if(channel){
				this.currentContentChannel = this.channels[channel].name;
			}

			if(game){
				this.$searchOptions.val('games');
				this.$searchField.val(game);
				this.searchContent();
			}

			this.getData({
				type: type, 
				targetElement: '#content-'+type, 
				targetChannel: this.currentContentChannel
			});
		},
		searchContent: function(e){
			if( this.$searchField.val() ){
				this.getData({
					type: 'search',
					searchTerm: this.$searchField.val(),
					searchType: this.$searchOptions.val()
				});
			}
			e.preventDefault();
			return false;
		},
		ctaHandler: function(e){
			var $target = $(e.currentTarget),
					channel = $target.parent().attr('data-fullstream-channel');

			if( $target.hasClass('cta-channels-chat') ){
				if(this.current.name && this.settings.chat){
					this.$body.toggleClass('show-chat');
				}
				this.$body.removeClass('hide-sidebar');
			}else if( $target.hasClass('cta-sidebar') ){
				this.$body.toggleClass('hide-sidebar');
			}else if( $target.hasClass('cta-menu') ){
				this.$body.toggleClass('show-content');
			}else if( $target.hasClass('cta-close-pip') ){
				this.$body.removeClass('show-pip');
				this.$pip.find('iframe').attr('src', '');
			}else if( $target.hasClass('cta-disconnect') ){
				this.settings.authenticated = false;
				this.saveSettings();
				Twitch.logout();
				location.replace('https://secure.twitch.tv/settings/connections');
			}else if( $target.hasClass('cta-pip') ){
				this.changeEmbeds({pipId: channel})
			}else if( $target.hasClass('cta-settings') ){
				this.$settings.toggle();
			}else if( $target.hasClass('cta-notification') ){
				if( $target.hasClass('cta-token') ){
					Twitch.login({ scope: this.scopes });
				}else if( $target.hasClass('cta-switcher') ){
					this.settings.switcher = false;
					this.saveSettings();
				}else{
					this.$loading.hide();
				}
				this.$notification.hide();
			}
		},
		notify: function(args){
			this.$notification.html( $.tmpl('notification', args) ).show();
		},
		switcher: function(){
			if(this.settings.switcher){
				var hit = false,
						count = 0;
				while(!hit){
					if(this.settings.switcherChannels[count]){
						var id = this.settings.switcherChannels[count];
					
						if(this.channels[id].name == this.current.name && this.channels[id].live){
							hit = true;
						}else if(this.channels[id].live){
							this.current = this.channels[id];
							this.currentContentChannel = this.current.name;
							this.changeEmbeds();
							this.render();
							hit = true;
						}
						count ++;
					}else{
						hit = true;
					}
				}
			}
		},
		switcherHandler: function(e){
			var $target = $(e.currentTarget);
					
			if( $target.parent().hasClass('availible-switcher-channels') ){
				var channel = $target.attr('data-fullstream-channel');
				this.settings.switcherChannels[this.settings.switcherChannels.length] = channel;
			}else if( $target.hasClass('switcher-remove') ){
				var channel = $target.parent().attr('data-fullstream-channel');
				this.settings.switcherChannels.splice(this.settings.switcherChannels.indexOf(channel), 1);
			}

			this.saveSettings();
			this.render();
		},
		sortSwitcher: function(e){
			var sorted = this.$switcherChannels.find('.switcher-channel'),
					arr = [];

			sorted.each(function(index){
				arr[arr.length] = $(sorted[index]).attr('data-fullstream-channel');
			})
			
			this.settings.switcherChannels = arr;
			this.saveSettings();
			this.render();
		}
	}

	var Channels = {
		create: function(data){
			var arr = [];
			for(x in data){
				arr[arr.length] = Channel.create(data[x]);
			}
			return arr;
		}
	}

	var Channel = {
		name: null,
		display_name: null,
		game: null,
		gameIcon: 'fa-gamepad',
		viewers: 0,
		video_height: 0,
		average_fps: 0,
		preview: null,
		status: null,
		logo: 'assets/images/logo.png',
		partner: false,
		url: null,
		views: 0,
		followers: 0,
		host: null,
		hosted: false,
		is_playlist: false,
		live: false,
		type: 'offline',
		create: function(data){
			var instance = Object.create(this);
			instance.update(data);
			return instance;
		},
		update: function(data){
			for(x in data){
				if(data[x] && data[x].medium){
					var d = new Date(),
							dateString = (d.getMonth()+1)+'.'+d.getDate()+'.'+d.getHours();
					
					this.updateProperty(x, data[x].medium+'?v='+dateString);
				}else{
					this.updateProperty(x, data[x]);
				}
			}
			for(y in data.channel){
				this.updateProperty(y, data.channel[y]);
			}
			if(data.is_playlist){
				this.updateProperty('type', 'playlist');
			}else if('is_playlist' in data){
				this.updateProperty('type', 'online');
			}

			this.updateProperty('gameIcon', GameIcon.getIcon(this.game) );

		},
		updateProperty: function(key, value){
			if( key in this && value){
				switch(key){
					case 'viewers':
					case 'followers':
					case 'views':
						this[key] = Number.format(value.toString());
						break;
					case 'video_height':
					case 'average_fps':
						this[key] = Math.floor(value - (value%5));
						break;
					default:
						this[key] = value;
						break;
				}
			}
		}
	}

	var Vod = {
		views: null,
		length: null,
		created_at: null,
		preview: null,
		title: null,
		description: null,
		game: null,
		name: null,
		_id: null,
		display_name: null,
		logo: null,
		url: null,
		create: function(data){
			var instance = Object.create(this);
			Object.keys(data).forEach(function(key){
				if(key in instance){
					switch(key){
						case 'views':
							instance[key] = Number.format(data[key]);
							break;
						case 'length':
							instance[key] = Number.formatTime(data[key]);
							break;
						case 'created_at':
							instance[key] = Number.getTheDate(data[key]);
							break;
						default:
							instance[key] = data[key];
							break;
					}
				}
			});
			return instance;
		}
	}

	var Number = {
		format: function(num){
			num = num.toString(),
			string = '',
			count = 0;
			
			for(var i=num.length-1; i>=0; i--){
				string += num[i];
				count++;
				
				if(count == 3 && i != 0){
					count=0;
					string += ',';
				}
			}

			return string.split("").reverse().join("");
		},
		formatTime: function(num){
			var hours = Math.floor(num/3600),
					min = Math.floor( (num%3600)/60 ),
					sec = Math.floor(num%60);
					string = this.doubleDigit(min)+':'+this.doubleDigit(sec);
			
			if(hours > 0){
				string = hours+':'+string;
			}

			return string;
		},
		doubleDigit: function(num){
			if(num < 10){
				return '0'+num;
			}else{
				return num;
			}
		},
		getTheDate: function(string){
			var x = new Date(string),
					year  = x.getFullYear(),
					month = x.getMonth()+1,
					day  = x.getDate();

			return year+'.'+this.doubleDigit(month)+'.'+this.doubleDigit(day);
		}
	}

	var Games = {
		create: function(data){
			var arr = [];
			for(x in data){
				arr[arr.length] = Game.create(data[x]);
			}
			return arr;
		}
	}

	var Game = {
		name: null,
		box: null,
		channels: null,
		viewers: null,
		create: function(data){
			var instance = Object.create(this);
			if(data.game){
				instance.update(data);
				instance.update(data.game);
			}else{
				instance.update(data);
			}
			return instance;
		},
		update: function(data){
			for(key in this){
				if(key in data){
					switch(key){
						case 'channels':
						case 'viewers':
							this[key] = Number.format(data[key]);	
							break;
						default:
						 this[key] = data[key];
						 break;
					}
				}
			}
		}
	}
	
	var GameIcon = {
		icons: {
			'fa-file-video-o'		: ['playlist'],
			'fa-money'					: ['poker', 'blackjack'],
			'fa-music'					: ['music'],
			'fa-code'						: ['programming', 'game development'],
			'fa-paint-brush'		: ['creative'],
			'fa-microphone'	 		: ['gaming talk shows'],
			'fa-truck'					: ['euro truck Simulator', 'euro truck simulator 2', 'american truck simulator', 'farming simulator 2015'],
			'fa-cubes'					: ['minecraft', 'terraria', 'minecraft: xbox one edition'],
			'fa-space-shuttle'	: ['elite: dangerous', 'eve online', 'star citizen'],
			'fa-rocket'					: ['kerbal space program'],
			'fa-fighter-jet'		: ['arma', 'arma ii', 'arma iii', 'battlefield 4', 'battlefield 3','war thunder'],
			'fa-plane'					: ['microsoft flight simulator x'],
			'fa-ship'						: ['world of warships'],
			'fa-car'						: ['rocket league', 'gran turismo 5', 'gran turismo 6', 'assetto corsa', 'project cars', 'the crew', 'forza motorsport 5', 'forza horizon 2', 'iracing.com'],
			'fa-wrench'					: ['automation - the car company tycoon game', 'truck mechanic simulator 2015', 'car mechanic simulator 2015', 'car mechanic simulator 2014'],
			'fa-train'					: ['train simulator 2015', 'train simulator 2014'],
			'fa-building'				: ['cities: skylines'],
			'fa-bus'						: ['omsi', 'omsi 2'],
			'fa-map-marker'			: ['geoguessr'],
			'fa-stethoscope'		: ['surgeon simulator 2013'],
			'fa-birthday-cake'	: ['portal', 'portal 2'],
			'fa-rebel'					: ['star wars: the old republic', 'star wars battlefront', 'star wars: battlefront 2', 'star wars: battlefront'],
			'fa-hand-spock-o'		: ['star trek online'],
			'fa-factory'				: ['factorio'],
			'fa-futbol-o'				: ['fifa 15', 'fifa 14'],
			'fa-circle'					: ['agar.io']
		},
		getIcon: function(game){
			var gameIcon = 'fa-gamepad';
			if(game){
				for(icon in this.icons){
					if( this.icons[icon].indexOf( game.toString().toLowerCase() ) > -1){
						gameIcon = icon;
					}
				}
			}

			return gameIcon;
		}
	}

	$(document).ready( twitchBox.init.bind(twitchBox) );
})(jQuery);