<!Doctype HTML>

<html>

<head>

	<title>Sanctarius</title>
	<meta charset="UTF-8">
	<link rel="stylesheet" type="text/css" href="style.css">
	<link href='http://fonts.googleapis.com/css?family=Open+Sans:700,300,400' rel='stylesheet' type='text/css'>

</head>

<body>

	<header class="global">

		<img src="images/logo.png">

		<ul>
			<li><a href="index.html">Accueil</a></li>
			<li><a href="#">A propos</a></li>
			<li><a href="Programme.html">Programme</a></li>
			<li><a href="videos.html">Vidéos</a></li>
			<li><a href="#">Contact</a></li>
		</ul>

		<div class="clear"></div>


		<ul class="rs">
			<li><a href="#"><img src="images/fb.png"></a></li>
			<li><a href="#"><img src="images/tw.png"></a></li>
			<li><a href="#"><img src="images/yt.png"></a></li>
			<li><a href="#"><img src="images/twi.png"></a></li>
		</ul>

		<div class="clear"></div>

		<link rel="stylesheet" type="text/css" href="style2.css">

		<div class="wrapper">  
    <div id="notreformulaire">
    <form name="form1" id="formulairedecontact" method="post" action="envoyer.php">
    <h1>CONTACTEZ-MOI !! C'EST GRATUIT !! :D </h1>
	<p>Veuillez remplir les champs ci-dessous afin de pouvoir me contacter ! :D</p>	
        <label>
		<span> <a color="blue" >Nom*: </a> </span>
        <input type="text" placeholder="Entrez votre nom" name="name" id="name" required autofocus>
        </label>
        
        <label>
		<span>Ville*:</span>    
		<input type="text" placeholder="Entrez votre ville" name="city" id="city" required>
        </label>
        
        <label>
		<span>Telephone:</span>
        <input type="tel" placeholder="Votre numero de telephone" name="phone" id="phone">
        </label>
        
        <label>
		<span>Email*:</span>
        <input type="email" placeholder="Votre-email@gmail.com" name="email" id="email" required>
      	</label>
      
	    <label>
		<span>Message:</span>
		<textarea name="monmessage" id="monmessage" rows="4" cols="50"></textarea>
		
      	</label>
		
		<input class="sendButton" type="submit" name="Submit" value="Envoyer">
			
	</form>
	</div>
   </div>

		


	<footer>
		<p>Sanctarius 2015. Tous droits réservés.<br>Site réalisé par Sanctarius</p>
	</footer>



</body>


</html>