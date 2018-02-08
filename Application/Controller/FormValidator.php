<?php
namespace Vigas\Controller;

class FormValidator
{
    public function checkEmail($email)
    {
        if(preg_match("#^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,20}$#", $email))
        {
            return true; 
        }
        else
        {
            return false;
        }
    }
    
    public function checkAlphanum($string)
    {
        if(preg_match("#^[a-zA-Z0-9]{3,40}$#", $string))
        {
            return true; 
        }
        else
        {
            return false;
        } 
    }
    
    public function checkLength($string, $min, $max)
    {
        if(strlen($string) >= $min && strlen($string) <= $max)
        {
            return true;  
        }
        else
        {
            return false;        
        }
    }
    
}

