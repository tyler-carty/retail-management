<?php

class Item
{
    public $ItemEAN;
    public $ItemSKU;
    public $ItemName;
    public $ItemSize;
    public $ItemCategory;
    public $ItemPrice;
    public $ItemStock;
    public $ItemSales;

    public function __construct($ean, $sku, $name, $size, $category, $price, $stock, $sales)
    {
        $this->ItemEAN = $ean;
        $this->ItemSKU = $sku;
        $this->ItemName = $name;
        $this->ItemSize = $size;
        $this->ItemCategory = $category;
        $this->ItemPrice = $price;
        $this->ItemStock = $stock;
        $this->ItemSales = $sales;
    }

    public function getItemEAN()
    {
        return $this->ItemEAN;
    }

    public function getItemSKU()
    {
        return $this->ItemSKU;
    }

    public function getItemName()
    {
        return $this->ItemName;
    }

    public function getItemSize()
    {
        return $this->ItemSize;
    }

    public function getItemCategory()
    {
        return $this->ItemCategory;
    }

    public function getItemPrice()
    {
        return $this->ItemPrice;
    }

    public function getItemStock()
    {
        return $this->ItemStock;
    }

    public function getItemSales()
    {
        return $this->ItemSales;
    }
}

?>
