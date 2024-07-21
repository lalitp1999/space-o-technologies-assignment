<?php
namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class NewsControllerTest extends TestCase
{
    /** @test */
    public function it_fetches_articles_successfully()
    {
        $response = $this->get('/api/news');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => [
                'source',
                'author',
                'title',
                'description',
                'url',
                'publishedAt',
            ],
        ]);
    }

    /** @test */
    public function it_returns_error_if_api_fails()
    {
        config(['services.newsapi.key' => 'invalid_key']);

        $response = $this->get('/api/news');

        $response->assertStatus(500);
        $response->assertJson(['error' => 'Failed to fetch articles']);
    }
}
