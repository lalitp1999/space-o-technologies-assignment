<?php
namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;
use App\Models\User;

class NewsControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_fetches_articles_successfully()
    {
        // Create and authenticate a user
        $user = User::factory()->create();
        $this->actingAs($user);

        // Mock the external API response
        Http::fake([
            'https://newsapi.org/v2/everything*' => Http::response([
                'status' => 'ok',
                'articles' => [
                    [
                        'source' => ['name' => 'Test Source'],
                        'author' => 'Test Author',
                        'title' => 'Test Title',
                        'description' => 'Test Description',
                        'publishedAt' => now()->toIso8601String(),
                    ]
                ]
            ], 200),
        ]);

        $response = $this->post('/news');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'status',
            'message',
            'data' => [
                'current_page',
                'data' => [
                    '*' => [
                        'source' => ['name'],
                        'author',
                        'title',
                        'description',
                        'publishedAt',
                    ]
                ],
                'first_page_url',
                'from',
                'last_page',
                'last_page_url',
                'links' => [
                    '*' => [
                        'url',
                        'label',
                        'active'
                    ]
                ],
                'next_page_url',
                'path',
                'per_page',
                'prev_page_url',
                'to',
                'total'
            ]
        ]);
    }

    /** @test */
    public function it_returns_error_if_api_fails()
    {
        // Create and authenticate a user
        $user = User::factory()->create();
        $this->actingAs($user);

        // Mock the external API response
        Http::fake([
            'https://newsapi.org/v2/everything*' => Http::response(null, 500),
        ]);

        $response = $this->post('/news');

        $response->assertStatus(500);
        $response->assertJson([
            'status' => false,
            'message' => 'An error occurred while fetching the news articles.',
            'data' => [],
        ]);
    }
}
