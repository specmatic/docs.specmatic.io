document.addEventListener('DOMContentLoaded', () => {
    function synchronizeTabsInPage(targetTab, label) {
        document.querySelectorAll('.tab-click').forEach(otherTab => {
            if (otherTab === targetTab) {
                return; // already handled
            }

            const otherLabel = otherTab.textContent.trim();
            if (otherLabel !== label) {
                return;
            }

            const otherWrapper = otherTab.closest('.tab-wrapper');
            if (!otherWrapper) {
                return;
            }

            // Deactivate all tabs/contents in that wrapper
            otherWrapper.querySelectorAll('.tab li').forEach(li => li.classList.remove('active'));
            otherWrapper.querySelectorAll('.tab-content li').forEach(li => li.classList.remove('active'));

            // Activate the matching tab and its corresponding content in that wrapper
            otherTab.parentElement.classList.add('active');
            const otherSelector = otherTab.getAttribute('data-tab-content-selector');
            const otherContent = otherWrapper.querySelector(`[data-tab-content-id="${otherSelector}"]`);
            if (otherContent) {
                otherContent.classList.add('active');
            }
        });
    }

    function activateTabAndSync(wrapper, targetTab, targetSelector, synchronizeTabsInPage, label) {
        // Deactivate all tabs and contents within the same wrapper
        wrapper.querySelectorAll('.tab li').forEach(li => li.classList.remove('active'));
        wrapper.querySelectorAll('.tab-content li').forEach(li => li.classList.remove('active'));

        // Activate the target tab and its corresponding content
        targetTab.parentElement.classList.add('active');
        const targetContent = wrapper.querySelector(`[data-tab-content-id="${targetSelector}"]`);
        if (targetContent) {
            targetContent.classList.add('active');
        }

        // Synchronize other tabs across the document that have the same label
        synchronizeTabsInPage(targetTab, label);
    }


    function activateTabById(tabId) {
        const targetTab = document.getElementById(tabId);
        if (targetTab) {
            const wrapper = targetTab.closest('.tab-wrapper');
            if (wrapper) {
                const targetSelector = targetTab.getAttribute('data-tab-content-selector');
                const label = targetTab.textContent.trim();

                activateTabAndSync(wrapper, targetTab, targetSelector, synchronizeTabsInPage, label);
                return true;
            }
        }
        return false;
    }

    const tabWrappers = document.querySelectorAll('.tab-wrapper');

    tabWrappers.forEach(wrapper => {
        const tabs = wrapper.querySelectorAll('.tab-click');

        tabs.forEach(targetTab => {
            targetTab.addEventListener('click', (event) => {
                const targetSelector = targetTab.getAttribute('data-tab-content-selector');
                const label = targetTab.textContent.trim();
                const tabId = targetTab.id;

                // Update URL hash without causing scroll
                history.replaceState(null, null, `#${tabId}`);

                activateTabAndSync(wrapper, targetTab, targetSelector, synchronizeTabsInPage, label);
            });
        });
    });


    // Check for hash in URL and activate the corresponding tab on page load
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        activateTabById(hash);
    }
});
