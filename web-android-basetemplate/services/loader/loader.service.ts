class LoaderService {

  private show:
    (() => void) | null = null;

  private hide:
    (() => void) | null = null;

  register(
    showFn: () => void,
    hideFn: () => void
  ) {

    this.show = showFn;

    this.hide = hideFn;
  }

  showLoader() {

    this.show?.();
  }

  hideLoader() {

    this.hide?.();
  }
}

export default new LoaderService();