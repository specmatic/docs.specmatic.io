document.addEventListener('DOMContentLoaded', () => {
  const tabWrappers = document.querySelectorAll('.tab-wrapper');

  tabWrappers.forEach(wrapper => {
    const tabs = wrapper.querySelectorAll('.tab-click');

    tabs.forEach(tab => {
      tab.addEventListener('click', (event) => {
        const clickedTab = tab; // use the bound element (handles clicks on inner elements)
        const targetSelector = clickedTab.getAttribute('data-tab-content-selector');
        const label = clickedTab.getAttribute('data-tab-label') || clickedTab.textContent.trim();

        // Deactivate all tabs and contents within the same wrapper
        wrapper.querySelectorAll('.tab li').forEach(li => li.classList.remove('active'));
        wrapper.querySelectorAll('.tab-content li').forEach(li => li.classList.remove('active'));

        // Activate the clicked tab and its corresponding content
        clickedTab.parentElement.classList.add('active');
        const targetContent = wrapper.querySelector(`[data-tab-content-id="${targetSelector}"]`);
        if (targetContent) targetContent.classList.add('active');

        // Synchronize other tabs across the document that have the same label
        document.querySelectorAll('.tab-click').forEach(otherTab => {
          if (otherTab === clickedTab) return; // already handled

          const otherLabel = otherTab.getAttribute('data-tab-label') || otherTab.textContent.trim();
          if (otherLabel !== label) return;

          const otherWrapper = otherTab.closest('.tab-wrapper');
          if (!otherWrapper) return;

          // Deactivate all tabs/contents in that wrapper
          otherWrapper.querySelectorAll('.tab li').forEach(li => li.classList.remove('active'));
          otherWrapper.querySelectorAll('.tab-content li').forEach(li => li.classList.remove('active'));

          // Activate the matching tab and its corresponding content in that wrapper
          otherTab.parentElement.classList.add('active');
          const otherSelector = otherTab.getAttribute('data-tab-content-selector');
          const otherContent = otherWrapper.querySelector(`[data-tab-content-id="${otherSelector}"]`);
          if (otherContent) otherContent.classList.add('active');
        });
      });
    });
  });
});
