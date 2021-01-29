// Temporary file to crate a new blog post

() => {
    fetch('/api/blogs', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: 'My title',
            content: 'My content'
        })
    });
}