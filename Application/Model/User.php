<?php
namespace Vigas\Model;

/**
* Class User.
* Manage a user and interact with database
*/
class User
{
    /**
    * @var int $id user id
    */
    protected $id;
    
    /**
    * @var string $username username 
    */
    protected $username;
    
    /**
    * @var string $email user email address
    */
    protected $email;
    
    /**
    * @var boolean $first_link_done true if the user linked his streaming platform account(s) at least once, false otherwise
    */
    protected $first_link_done;
    
    /**
    * @var string $reset_pwd_token reset password token
    */
    protected $reset_pwd_token;
    
    /**
    * @var string $reset_pwd_token_endat reset password token expiration datetime 
    */
    protected $reset_pwd_token_endat;
	
	/**
    * @var array $linked_accounts user's linked accounts
    */
    protected $linked_accounts;

    private function builRequestConditions($conditions)
    {
        $request_data=['conditions' => '', 'value' => []];
        $i = 0;
        $lenght = count($conditions);
        foreach($conditions as $column => $value)
        {
            $request_data['conditions'] .=  $column.' = :'.$column;
            if($i != $lenght -1)
            {
                 $request_data['conditions'] .= ' AND ';
            }     
            if($column == 'password')
            {
                $request_data['value'][$column] = sha1($value);
            }
            else
            {
                $request_data['value'][$column] = $value;
            }
            $i++;
        }
        return $request_data;
    }
    
    /**
    * Get user from the database and set User object properties
    * @param object PDO $db database connection object
    * @param string $column the column name used on the WHERE clause
    * @param mixed $value the value used on the WHERE clause
    * @return false if user has not been found
    */
    public function getUser($db, $conditions)
    {
        $request_data = $this->builRequestConditions($conditions);
        $req = $db->prepare('SELECT id, username, email, first_link_done, reset_pwd_token, reset_pwd_token_endat FROM User WHERE '.$request_data['conditions']);
        $user_data = $req->execute($request_data['value']);
        $user_data = $req->fetch();
        if(!$user_data)
        {
            return false;
        }
        else
        {
            $this->id = $user_data['id'];
            $this->username = $user_data['username'];
            $this->email = $user_data['email'];
            $this->first_link_done = $user_data['first_link_done'];
            $this->reset_pwd_token = $user_data['reset_pwd_token'];
            $this->reset_pwd_token_endat = $user_data['reset_pwd_token_endat'];
        }
    }

    /**
    * Create user account
    * @param object PDO $db database connection object
    * @param string $username the username
    * @param string $email the user email address
    * @param string $password the user password
    * @return boolean returns true if account has been created, false otherwise
    */
    public function insertUser($db, $username, $email, $password)
    {
        $req = $db->prepare('INSERT INTO User(username, email, password) VALUES(:username, :email, :password)');
        $resultat = $req->execute(array(
            'username' => $username,
            'email' => $email,
            'password' => sha1($password)
        ));

        if (!$resultat)
        {
            print_r($req->errorInfo());
            return false;
        }
        else
        {
            return true;
        }	
    }

    /**
    * Change user password
    * @param object PDO $db database connection object
    * @param int $id the user id
    * @param string $username the username
    * @param string $current_password the surrent user password
    * @param string $new_password the new user password
    * @return int returns 0 if worng username or password, -1 if setting new password failed, 1 if it succeed
    */
    public function updatePassword($db, $conditions, $new_password)
    {
        $request_data = $this->builRequestConditions($conditions);
        $request_data['value']['new_password'] = sha1($new_password);
        $req = $db->prepare('UPDATE User SET password=:new_password WHERE '.$request_data['conditions']);
        $resultat = $req->execute($request_data['value']);
        if (!$resultat)
        {
            print_r($req->errorInfo());
            return false;
        }
        else
        {
            return true;
        }	    
    }
    
    public function deleteResetPwdToken($db, $id)
    {
        $req = $db->prepare('UPDATE User SET reset_pwd_token=NULL, reset_pwd_token_endat=NULL WHERE id=:id');
        $resultat = $req->execute(array(
            'id' => $id
        ));
        if (!$resultat)
        {
            print_r($req->errorInfo());
            return false;
        }
        else
        {
            return true;
        }	    
    }

    /**
    * Check if an account already exist with the provided username
    * @param object PDO $db database connection object
    * @param string $username the username address to test
    * @return boolean returns true if the username is unique (not found in database), false otherwise
    */
    public function checkUniqueUsername($db, $username)
    {
        $user_data = $this->getUser($db, ['username' => $username]);
        if($user_data === false)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
    * Check if an account already exist with the provided email address
    * @param object PDO $db database connection object
    * @param string $email the email address to test
    * @return boolean returns true if the email address is unique (not found in database), false otherwise
    */
    public function checkUniqueEmail($db, $email)
    {
        $user_data = $this->getUser($db, ['email' => $email]);
        if($user_data === false)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
    * Set first link done to true
    * @param object PDO $db database connection object
    * @param int $id user id
    * @return boolean returns true if first link done has been set to true, false otherwise
    */
    public function firstLinkDone($db, $id)
    {	
        $user_data = $this->getUser($db, ['id' => $id]);
        if($user_data !== false)
        {
            $req = $db->prepare('UPDATE User SET first_link_done=TRUE WHERE id= :id');
            $resultat = $req->execute(array(
                    'id' => $id
            ));
            $this->first_link_done = true;
            return $this->first_link_done;
        }
        else
        {
            return false;
        }
    }

    /**
    * Save reset password token and reset password token expiration datetime into database
    * @param object PDO $db database connection object
    * @param string $token the reset password token
    * @param int $id user id
    * @return boolean returns true if reset password token and reset password token expiration datetime has been saved, false otherwise
    */
    public function saveResetPwdToken($db, $token, $id)
    {	
        $token_endat=date("Y-m-d H:i:s", strtotime('now +30 Minutes'));
        $req = $db->prepare('UPDATE User SET reset_pwd_token=:token, reset_pwd_token_endat=:token_endat WHERE id= :id');
        $resultat = $req->execute(array(
            'token' => $token,
            'token_endat' => $token_endat,
            'id' => $id
        ));

        if (!$resultat)
        {
            print_r($req->errorInfo());
            return false;
        }
        else
        {
            return true;
        }	
    }

    /**
    * @return int $id user id
    */
    public function getId()
    {
        return $this->id;
    }

    /**
    * @return string $username username 
    */
    public function getUsername()
    {
            return $this->username;
    }

    /**
    * @return string $email user email address
    */
    public function getEmail()
    {
        return $this->email;
    }

    /**
    * @return boolean $first_link_done true if the user linked his streaming platform account(s) at least once, false otherwise
    */
    public function getFirstLinkDone()
    {
        return $this->first_link_done;
    }

    /**
    * @return string $reset_pwd_token reset password token
    */
    public function getResetPwdToken()
    {
        return $this->reset_pwd_token;
    }

    /**
    * @return string $reset_pwd_token_endat reset password token expiration datetime 
    */
    public function getResetPwdTokenEndat()
    {
        return $this->reset_pwd_token_endat;
    }

}
