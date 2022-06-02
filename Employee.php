<?php

class Employee
{
    public $EmployeeID;
    public $FirstName;
    public $LastName;
    public $Phone;
    public $Email;

    public function __construct($id, $first, $last, $phone, $email)
    {
        $this->EmployeeID = $id;
        $this->FirstName = $first;
        $this->LastName = $last;
        $this->Phone = $phone;
        $this->Email = $email;
    }

    public function getEmployeeID()
    {
        return $this->EmployeeID;
    }

    public function getFirstName()
    {
        return $this->FirstName;
    }

    public function getLastName()
    {
        return $this->LastName;
    }

    public function getPhone()
    {
        return $this->Phone;
    }

    public function getEmail()
    {
        return $this->Email;
    }

}

?>
