document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('shorten-form');
    const urlInput = document.getElementById('original-url');
    const shortenBtn = document.getElementById('shorten-btn');
    const resultContainer = document.getElementById('result-container');
    const shortUrlInput = document.getElementById('short-url');
    const copyBtn = document.getElementById('copy-btn');
    const errorMsg = document.getElementById('error-msg');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const originalUrl = urlInput.value.trim();

        // Basic validation
        if (!originalUrl) {
            showError('Please enter a valid URL.');
            return;
        }

        // Reset UI
        hideError();
        shortenBtn.innerText = 'Shortening...';
        shortenBtn.disabled = true;
        resultContainer.classList.add('hidden');

        try {
            // TinyURL API (No auth required)
            // https://tinyurl.com/api-create.php?url=...
            const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(originalUrl)}`);
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const shortUrl = await response.text();

            if (shortUrl.startsWith('Error')) {
               throw new Error('TinyURL could not shorten this link.'); 
            }

            // Success
            showResult(shortUrl);

        } catch (error) {
            console.error('Error:', error);
            showError('Failed to shorten URL. Please check the link and try again.');
        } finally {
            shortenBtn.innerText = 'Shorten';
            shortenBtn.disabled = false;
        }
    });

    copyBtn.addEventListener('click', () => {
        const textToCopy = shortUrlInput.value;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            // Feedback
            const originalText = copyBtn.innerText;
            copyBtn.innerText = 'Copied!';
            copyBtn.classList.add('copied');

            setTimeout(() => {
                copyBtn.innerText = originalText;
                copyBtn.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    });

    function showError(message) {
        errorMsg.innerText = message;
        errorMsg.classList.remove('hidden');
        urlInput.classList.add('error-border');
    }

    function hideError() {
        errorMsg.classList.add('hidden');
        urlInput.classList.remove('error-border');
    }

    function showResult(url) {
        shortUrlInput.value = url;
        resultContainer.classList.remove('hidden');
    }
});
