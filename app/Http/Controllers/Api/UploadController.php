<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Helpers\Uploader;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class UploadController
{
    public function save(Request $request): Response
    {
        $file = $request->files->get('file');
        $image = $file ? Uploader::upload($file) : null;

        return new JsonResponse(
            [
                'status' => $image ? 'ok' : 'error',
                'data' => $image,
            ],
            $image ? Response::HTTP_OK : Response::HTTP_BAD_REQUEST,
        );
    }
}