<?php

use PHPUnit\Framework\TestCase;

use Illuminate\Testing\Fluent\AssertableJson;

//@desc Tests made to be run on a framework like Laravel, it was getting hard to install the
//dependencies to run tests
class ProductListTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */

    // @desc Tests the route to get the Product Listing
    public function testProductsListingRoute()
    {
        //DESC
        $response = $this->get('/?startlimit=1&endlimit=10&order=desc');
        $response->assertEquals(200, $response->getStatusCode());
        //ASC
        $response = $this->get('/?startlimit=1&endlimit=10&order=asc');
        $response->assertEquals(200, $response->getStatusCode());
    }

    // @desc Tests the route to get the total of Products
    public function testProductsTotalRoute()
    {
        $response = $this->get('/?total');
        $response->assertEquals(200, $response->getStatusCode());
    }

    // @desc Tests that the Product's listing is a JSON
    public function testProductsListingIsJSON(){
        $response = $this->getJson('/?startlimit=1&endlimit=10&order=desc');

        $response->assertStatus(200);
    }
    
    // @desc Tests that the Product's total is a JSON
    public function testProductsTotalIsJSON(){
        $response = $this->getJson('/?total');

        $response->assertStatus(200);
    }

    // @desc Tests the structure and the attributes of the Product's Listing JSON 
    public function testProductsListingHasAttributes(){
        $response = $this->getJson('/?startlimit=1&endlimit=10&order=desc');
        $response->assertJsonStructure(
            ['*' =>['brand_name','product_name','base_price','actual_price','filename']]
        );
    }

    // @desc Tests the structure and the attributes of the Product's total JSON 
    public function testProductsTotalHasAttributes(){
        $response = $this->getJson('/?startlimit=1&endlimit=10&order=desc');
        $response->assertJsonStructure(
            ['*' =>['total']]
        );
    }

    // @desc Tests the fields types of the Product's listing in the JSON
    public function testProductsListingAttributesTypes(){
        $response = $this->getJson('/?startlimit=1&endlimit=10&order=desc');
        $response->assertJson(fn (AssertableJson $json) =>
            $json->whereAllType([
                    '0.id' => 'integer',
                    '0.brand_name' => 'string',
                    '0.product_name' => 'string',
                    '0.base_price' => 'string',
                    '0.actual_price' => 'string',
                    '0.filename' => 'string',
            ])
        );
    }

    // @desc Tests the fields types of the Product's Total in the JSON
    public function testProductsTotalAttributesTypes(){
        $response = $this->getJson('/?total');
        $response->assertJson(fn (AssertableJson $json) =>
            $json->whereAllType([
                    '0.total' => 'string',
            ])
        );
    }
}