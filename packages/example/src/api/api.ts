export class Api {
  /**
   * login adn password for demo "test@test.com" and "123"
   * @param login string
   * @param password string
   */
  async login(login: string, password: string): Promise<boolean> {
    if (login === 'test@test.com' && password === '123') {
      localStorage.setItem('_is_logged', '1');

      return true;
    }
    return false;
  }

  async isAuthenticated(): Promise<boolean> {
    return localStorage.getItem('_is_logged') === '1';
  }

  async logout(): Promise<void> {
    localStorage.removeItem('_is_logged');
  }
}
