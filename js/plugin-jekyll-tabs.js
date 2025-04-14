document.addEventListener('DOMContentLoaded', () => {
  const tabWrappers = document.querySelectorAll('.tab-wrapper');

  tabWrappers.forEach(wrapper => {
    const tabs = wrapper.querySelectorAll('.tab-click');

    tabs.forEach(tab => {
      tab.addEventListener('click', (event) => {
        const targetSelector = event.target.getAttribute('data-tab-content-selector');

        // Deactivate all tabs and contents within the same wrapper
        wrapper.querySelectorAll('.tab li').forEach(li => li.classList.remove('active'));
        wrapper.querySelectorAll('.tab-content li').forEach(li => li.classList.remove('active'));

        // Activate the clicked tab and its corresponding content
        event.target.parentElement.classList.add('active');
        wrapper.querySelector(`[data-tab-content-id="${targetSelector}"]`).classList.add('active');
      });
    });
  });
});
