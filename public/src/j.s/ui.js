export function showView(viewToShow) {
    document.querySelectorAll('section').forEach(view => view.classList.add('hide'));
    viewToShow.classList.remove('hide');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function toggleModal(modal, show) {
    console.log('Toggling modal:', modal.id, 'Show:', show); // Debugging
    modal.classList.toggle('hide', !show);
    document.body.style.overflow = show ? 'hidden' : 'auto';
}