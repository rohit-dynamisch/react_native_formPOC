export const login = (auth) => ({
    type: 'LOGIN',
    payload: auth
  });
  
  export const logout = () => ({
    type: 'LOGOUT'
  });

  export const signup = (user) => ({
    type: 'SIGNUP',
    payload:user
  });
  