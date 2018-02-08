<?php
namespace Vigas\Application\View;

use Vigas\Application\Controller\FormBuilder;
use Vigas\Application\Application;
use Vigas\Application\Model\User;

abstract class Forms
{
    public static function getLoginForm($target_url, $method, $value)
    {
        $form = new FormBuilder($target_url, $method);
        $form->getInputHTML('log-username', 'Username', 'text', 'log-username', $value);
        $form->getInputHTML('log-password', 'Password', 'password', 'log-password');
        $form->getOneCheckboxHTML('log-remember-me', 'Remember me', 'checkbox', 'log-remember-me', 'checkbox-inline', 'checked');
        $form->getSubmitButton('Sign In', 'login', 'btn btn-default');
        echo $form;
    }
    
    public static function getCreateAccountForm($target_url, $method, $value_array)
    {
        isset($value_array['ca-email']) ? $email = $value_array['ca-email'] : $email = '';
        isset($value_array['ca-username']) ? $username = $value_array['ca-username'] : $username = '';
        $form = new FormBuilder($target_url, $method);
        $form->getInputHTML('ca-email', 'Email address', 'email', 'ca-email', $email);
        $form->getInputHTML('ca-username', 'Username', 'text', 'ca-username', $username);
        $form->getInputHTML('ca-password', 'Password', 'password', 'ca-password');
        $form->getInputHTML('ca-password-2', 'Confirm Password', 'password', 'ca-password-2');
        $form->getOneCheckboxHTML('ca-remember-me', 'Remember me', 'checkbox', 'ca-remember-me', 'checkbox-inline', 'checked');
        $form->getSubmitButton('Create Account', 'create-account', 'btn btn-default');
        echo $form;
    }
    
    public static function getForgotPasswordForm($target_url, $method, $email)
    {
        $form = new FormBuilder($target_url, $method);
        $form->getInputHTML('email', 'Email address', 'email', 'email', $email);
        $form->getSubmitButton('Reset Password', 'reset-password', 'btn btn-default');
        echo $form;
    }
    
    public static function getResetPasswordForm($target_url, $method)
    {
        $form = new FormBuilder($target_url, $method);
        $form->getInputHTML('password', 'Password', 'password', 'password');
        $form->getInputHTML('password-2', 'Confirm Password', 'password', 'password-2');
        $form->getSubmitButton('Set Password', 'set-password', 'btn btn-default');
        echo $form;
    }
    
    public static function getFindEmailForm($target_url, $method, $username)
    {
        $form = new FormBuilder($target_url, $method);
        $form->getInputHTML('username', 'Username', 'text', 'username', $username);
        $form->getSubmitButton('Find Email', 'find-email', 'btn btn-default');
        echo $form;
    }
    
    public static function getProfileForm($target_url, $method, User $user)
    {
        $form = new FormBuilder($target_url, $method);
        $form->getInputHTML('username', 'Username', 'text', 'username', ucfirst($user->getUsername()), 'disabled');
        $form->getInputHTML('email', 'Email address', 'email', 'email', $user->getEmail(), 'disabled'); 
        $form->getInputHTML('current-password', 'Current password', 'password', 'current-password');
        $form->getInputHTML('new-password', 'New Password', 'password', 'new-password');
        $form->getInputHTML('new-password-2', 'Confirm New Password', 'password', 'new-password-2');
        $form->getSubmitButton('Change Password', 'change-password', 'btn btn-default');
        echo $form;
    }
    
    public static function getAboutForm($target_url, $method, $value_array)
    {
        isset($value_array['email']) ? $email = $value_array['email'] : $email = '';
        isset($value_array['message']) ? $message = $value_array['message'] : $message = '';
        isset($value_array['message-type']) ? $selected = $value_array['message-type'] : $selected = '';
        isset($value_array['url']) ? $url = $value_array['url'] : $url = '';
        
        $form = new FormBuilder($target_url, $method);
        $form->getSelectHTML('message-type', '', 'message-type', ['Feedback', 'Bug Report'], $selected);
        $form->getInputHTML('email', 'Your email adress (fill it if you expect a reply)', 'email', 'email', $email);
        
        if(isset($value_array['message-type']) && $value_array['message-type'] == 'Bug Report')
        {
            $form->getTextHTML('<p class="alert alert-info">Please provide as much details as you can on the bug (which page you were, what you were doing when the bug appeared, any error message you could have...)</p>');
            $form->getInputHTML('url', 'Webpage\'s URL where the bug appeared', 'text', 'url', $url);
        }
        
        $form->getTextareaHTML('message', 'Message', 'textarea', 'message', 10, $message);
        $form->getCaptcha(Application::CAPTCHA_CONF['siteKey']);
        $form->getSubmitButton('Submit', 'about-form', 'btn btn-default btn-form-about');
        echo $form;
    }
}

