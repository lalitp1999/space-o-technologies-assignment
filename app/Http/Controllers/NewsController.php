<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\BaseController;
use Illuminate\Pagination\LengthAwarePaginator;

class NewsController extends BaseController
{
    public function list(Request $request)
    {
        return inertia("News/List");
    }
    public function index(Request $request)
    {
        try {
            $query = $request->input('q', 'apple');
            $page = (int) $request->input('page', 1);
            $pageSize = (int) $request->input('pageSize', 10);
            $sortBy = $request->input('sortBy', 'publishedAt');
            $sortOrder = $request->input('sortOrder', 'desc');
            $source = $request->input('source', '');
            $from = $request->input('from', '');
            $to = $request->input('to', '');
            $author = $request->input('author', '');

            // Make the API request
            $response = Http::get('https://newsapi.org/v2/everything', [
                'q' => $query,
                'qInTitle' => $query,
                // 'sources' => $source,
                'apiKey' => config('services.newsapi.key'),
                'pageSize' => 100,
                'sortBy' => $sortBy,
                'sortOrder' => $sortOrder,
            ]);
            if ($response->failed()) {
                // dd($response['message']);
                return $this->sendError($response['message'] ?? 'An error occurred while fetching the news articles.');
                // return $this->sendError('Failed to fetch articles from the news API.');
            }

            $responseData = $response->json();

            if (isset($responseData['status']) && $responseData['status'] !== 'ok') {
                // dd($responseData['message']);
                return $this->sendError($responseData['message'] ?? 'An error occurred while fetching the news articles.');
            }

            $articles = collect($responseData['articles']);

            // Custom filter articles
            $filteredArticles = $articles->filter(function ($article) use ($author, $source, $from, $to) {
                $authorMatch = empty($author) || strpos($article['author'] ?? '', $author) !== false;
                $sourceMatch = empty($source) || strpos($article['source']['name'] ?? '', $source) !== false;
                $dateMatch = (empty($from) || (isset($article['publishedAt']) && strtotime($article['publishedAt']) >= strtotime($from))) &&
                    (empty($to) || (isset($article['publishedAt']) && strtotime($article['publishedAt']) <= strtotime($to)));
                return $authorMatch && $sourceMatch && $dateMatch;
            });

            $totalItems = $filteredArticles->count();
            $pagedArticles = $filteredArticles->slice(($page - 1) * $pageSize, $pageSize)->values();

            $paginator = new LengthAwarePaginator(
                $pagedArticles,
                $totalItems,
                $pageSize,
                $page,
                ['path' => $request->url(), 'query' => $request->query()]
            );
            return $this->sendSuccess($paginator, "News data retrieved successfully.");
        } catch (\Exception $e) {
            return $this->sendError("An error occurred: " . $e->getMessage());
        }
    }
}
