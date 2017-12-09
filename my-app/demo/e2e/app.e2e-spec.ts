import { WellfasterPage } from './app.po';

describe('wellfaster App', function() {
  let page: WellfasterPage;

  beforeEach(() => {
    page = new WellfasterPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
