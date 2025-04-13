document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-click');

    tabs.forEach(tab => {
      tab.addEventListener('click', (event) => {
        const targetSelector = event.target.getAttribute('data-tab-content-selector');

        // Deactivate all tabs and contents
        document.querySelectorAll('.tab li').forEach(li => li.classList.remove('active'));
        document.querySelectorAll('.tab-content li').forEach(li => li.classList.remove('active'));

        // Activate the clicked tab and its corresponding content
        event.target.parentElement.classList.add('active');
        document.querySelector(`[data-tab-content-id="${targetSelector}"]`).classList.add('active');
      });
    });
  });
