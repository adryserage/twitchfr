<?php
namespace Vigas\Controller;

require_once __DIR__.'/../vendor/PHPMailer/PHPMailerAutoload.php';

/**
 * Class Mailer extends PHPmailer.
 * Build and send email
 */
class Mailer extends \PHPmailer
{
    /**
    * @param string $From sender email address
    * @param string $FromName sender display name
    * @param string $Host SMTP host
    * @param string $Subject email subject
    * @param string $Body email body
    * @param string $AddAddress recipient email address
    * @param array $smtp_conf SMTP server informations
    */
    public function __construct($From, $FromName, $Host, $Subject, $Body, $AddAddress, $smtp_conf)
    {
        $this->From=$From;
        $this->FromName=$FromName;
        $this->IsSMTP();
        $this->Host=$Host;
        $this->SMTPAuth = true;
        $this->SMTPSecure = $smtp_conf['secure'];
        $this->Port = $smtp_conf['port'];
        $this->Username = $smtp_conf['username'];
        $this->Password = $smtp_conf['password'];
        $this->Subject=$Subject;
        $this->Body=$Body;
        $this->AddAddress($AddAddress);		
    }

    /** 
    * @return mixed returns true if email has been sent, false otherwise
    */
    public function sendMail()
    {
        if($this->Send())
        {
            return true;
        } 
        else
        {	
            return $this->ErrorInfo;
        }
    }
}

