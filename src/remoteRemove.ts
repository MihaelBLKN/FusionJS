"use strict"
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
export default (element: HTMLElement) => {
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            mutation.removedNodes.forEach((removed) => {
                if (removed === element) {
                    element.dispatchEvent(new Event("remove"));
                    observer.disconnect();
                }
            });
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}
