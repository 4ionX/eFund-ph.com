const toastQueue: any[] = [];
let isShowing = false;

export const showToast = (notif: any) => {
  toastQueue.push(notif);

  if (isShowing) return;

  processQueue();
};

const processQueue = () => {
  if (toastQueue.length === 0) {
    isShowing = false;
    return;
  }

  isShowing = true;

  const notif = toastQueue.shift();

  // 👉 YOUR UI TOAST HERE
  console.log('TOAST:', notif.title, notif.message);

  setTimeout(() => {
    processQueue();
  }, 2500); // duration per toast
};
