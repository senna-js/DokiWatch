export const handlePlayerMouse = () => {
    const videoElement = document.querySelector("video");
    if(!videoElement) return;

    videoElement.classList.remove('cursor-none');

    let timeout: number | undefined;

    const resetTimer = () => {
        console.log('resetTimer called');
        videoElement.classList.remove('cursor-none');
        clearTimeout(timeout);
        timeout = window.setTimeout(() => {
            videoElement.classList.add('cursor-none');
            console.log('cursor-none added');
        }, 2000);
    };

    const handleMouseLeave = () => {
        clearTimeout(timeout);
        videoElement.classList.remove('cursor-none');
    };

    // Clean up existing listeners to prevent duplicates
    videoElement.removeEventListener('mousemove', resetTimer);
    videoElement.removeEventListener('mouseenter', resetTimer);
    videoElement.removeEventListener('mouseleave', handleMouseLeave);

    // Add new listeners
    videoElement.addEventListener('mousemove', resetTimer);
    videoElement.addEventListener('mouseenter', resetTimer);
    videoElement.addEventListener('mouseleave', handleMouseLeave);

    // Initial state
    resetTimer();
}