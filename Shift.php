<?php

class Shift
{
    public $ShiftID;
    public $EmployeeID;
    public $Date;
    public $TimeIn;

    public function __construct($id, $eid, $date, $timein)
    {
        $this->ShiftID = $id;
        $this->EmployeeID = $eid;
        $this->Date = $date;
        $this->TimeIn = $timein;
    }

    public function getShiftID()
    {
        return $this->ShiftID;
    }

    public function getEmployeeID()
    {
        return $this->EmployeeID;
    }

    public function getDate()
    {
        return $this->Date;
    }

    public function getTimeIn()
    {
        return $this->TimeIn;
    }

}

?>
