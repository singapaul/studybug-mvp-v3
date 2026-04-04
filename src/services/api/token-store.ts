type TokenGetter = () => Promise<string | null>

let _getToken: TokenGetter = async () => null

export const tokenStore = {
  setGetter(fn: TokenGetter): void {
    _getToken = fn
  },
  getToken(): Promise<string | null> {
    return _getToken()
  },
}
