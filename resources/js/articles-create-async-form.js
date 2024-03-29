import Swal from "sweetalert2";

(function () {
    'use strict';

    const $form = document.getElementById('article-create-async-form');

    if (!$form) {
        return;
    }

    $form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData();

        formData.append('file', $form.file.files[0], $form.file.files[0].name);

        const uploadResponse = await fetch('/api/upload', { method: 'POST', body: formData });
        const uploadJson = await uploadResponse.json();

        const articleResponse = await fetch('/api/articles', {
            method: 'POST',
            body: JSON.stringify({
                title: $form.title.value,
                preview: $form.preview.value,
                content: $form.content.value,
                categories: [...$form['categories[]'].options].filter($o => $o.selected).map($o => parseInt($o.value)),
                image: uploadJson.data,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const articleJson = await articleResponse.json();

        Swal.fire({
            title: 'Ура!',
            text: 'Статья успешно добавлена!',
            icon: 'success',
            confirmButtonText: 'Перейте к статье',
            showCancelButton: true,
            cancelButtonText: 'Закрыть',
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                location.href = `/article/${articleJson.data.code}`;
            }
        })
    });
})();
