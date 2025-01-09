(function () {
    function swapHtml(oldBody, newBody) {
        oldBody.replaceChildren(...Array.from(newBody.children));
    }

    function updateHtmlDom(newHtmlContent) {
        const page = document.createElement("html");
        page.innerHTML = newHtmlContent;
        swapHtml(document.body, page.getElementsByTagName("body")[0]);
    }

    function getUpdatedPageContentAsync(contentLink) {
        // Replace url with updated ContentLink
        const url = location.href.replace(/,,[\d_]+/, ",," + contentLink);
        return fetch(url, { cache: "no-cache" }).then(function (response) {
            if (response.ok && !response.redirected) {
                return response.text();
            } else {
                throw new Error(response.statusText);
            }
        });
    }

    function subscribeEvent() {
        const epi = window.epi;
        if (epi.isEditable) {
            epi.subscribe("contentSaved", function (message) {
                getUpdatedPageContentAsync(message.contentLink)
                    .then(function (newHtmlContent) {
                        updateHtmlDom(newHtmlContent);
                    })
                    .catch(function (error) {
                        console.error("An error has occurred during fetch operation.", error);
                    });
            });
        }
    }

    window.addEventListener("load", function () {
        const epi = window.epi;

        if (!epi) {
            return;
        }
        if (epi.ready === true) {
            subscribeEvent();
        } else {
            epi.subscribe("epiReady", subscribeEvent);
        }
    });
})();
