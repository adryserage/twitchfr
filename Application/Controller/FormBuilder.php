<?php
namespace Vigas\Application\Controller;

class FormBuilder
{
	protected $html_fields = '';
	protected $target_url;
    protected $method;
    protected $class;
	
    public function __construct($target_url, $method, $class = null)
    {
        $this->target_url = $target_url;
        $this->method = $method;
        if($class != null)
        {
            $this->class = 'class="'.$class.'"';
        }
        
    }
    
    public function __toString()
    {
        return '<form '.$this->class.' action="'.$this->target_url.'" method="'.$this->method.'">'.$this->html_fields.'</form>';
    }
    
    private function surroundWithLabel($element, $label='')
    {
        $label != '' ? $label = "<label>".$label."</label>" : '';
        $this->html_fields .= "<div class=\"form-group\">".$label."".$element."</div>";
    }
    
    private function surround($element)
    {
        $this->html_fields .= "<div class=\"form-group\">".$element."</div>";
    }
        
    public function getInputHTML($id, $label, $type, $name, $value = '', $attribute = '')
	{
		$this->html_fields .= $this->surround(
                            "<label for=\"".$id."\">".$label."</label>
                            <input type=\"".$type."\" class=\"form-control\" id=\"".$id."\" name=\"".$name."\" value=\"".$value."\" ".$attribute.">");
	}
    
    public function getTextareaHTML($id, $label, $type, $name, $rows, $value = '', $attribute = '')
	{
        if($label != '')
        {
            $label = "<label for=\"".$id."\">".$label."</label>";
        }
		$this->html_fields .= $this->surround(
                            $label.
                            "<textarea class=\"form-control\" id=\"".$id."\" name=\"".$name."\" rows=\"".$rows."\" ".$attribute.">".$value."</textarea>");
	}
    
    public function getSelectHTML($id, $label, $name, array $options, $selected = '')
	{
        $options_html = '';
        foreach($options as $option)
        {
            if($selected == $option)
            {
                $options_html .= "<option selected>".$option."</option>";
            }
            else
            {
                $options_html .= "<option>".$option."</option>";
            }        
        }
		$this->html_fields .= $this->surround(
                            "<label for=\"".$id."\">".$label."</label>
                            <select class=\"form-control\" id=\"".$id."\" name=\"".$name."\">
                                ".$options_html."
                            </select>");
	}
    
    public function getCheckboxHTML($id, $label, $type, $name, $class, $attribute = '')
	{
		return  "<div class=\"".$class."\">
                <label class=\"".$class."\"><input type=\"".$type."\" id=\"".$id."\" name=\"".$name."\"  ".$attribute.">".$label."</label>
                </div>";
	}
    
    public function getMultipleCheckboxHTML(array $checkbox_array, $main_label)
    {
        $checkbox_html = '';
        foreach ($checkbox_array as $checkbox)
        {
            isset($checkbox[5]) ? $checkbox[5] = $checkbox[5] : $checkbox[5] = '';
            $checkbox_html .= $this->getCheckboxHTML($checkbox[0], $checkbox[1], $checkbox[2], $checkbox[3], $checkbox[4], $checkbox[5]);
        }
        $this->html_fields .= $this->surroundWithLabel($checkbox_html, $main_label);
    }
    
    public function getOneCheckboxHTML($id, $label, $type, $name, $class, $attribute = '', $main_label='')
    {
        $checkbox_html = $this->getCheckboxHTML($id, $label, $type, $name, $class, $attribute);
        $this->html_fields .= $this->surroundWithLabel($checkbox_html, $main_label);
    }
    
    public function getRadioHTML($id, $main_label, $type, $radios, $class, $attribute = '')
	{
        $radio_html = '';
        foreach($radios as $name => $label)
        {
            $radio_html .=  "<div class=\"".$class."\">
                            <label class=\"".$class."\"><input type=\"".$type."\" name=\"".$name."\" ".$attribute.">".$label."</label>
                            </div>";
        }
		$this->html_fields .= $this->surroundWithLabel($radio_html, $main_label);
	}
    
    public function getCaptcha($site_key)
    {
        $this->html_fields .= '<div class="g-recaptcha" data-sitekey="'.$site_key.'"></div>';
    }
    
    public function getSubmitButton($label, $name, $class)
    {
        $this->html_fields .= '<button name="'.$name.'" type="submit" class="'.$class.'">'.$label.'</button>';
    }
    
    public function getTextHTML($text)
    {
        $this->html_fields .= $text;
    }
    
}