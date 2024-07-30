const initialState = {
    auth: {
        email:"",
        password:""
    },
    users:[
    ]
  };
  
  export const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'LOGIN':
        return {
          ...state,
          auth: {
            ...action.payload
          }
        };
      case 'LOGOUT':
        return {
          ...state,
          auth: {
            email:"",
        password:""
          }
        };
        case 'SIGNUP':
          console.warn([...state.users,action.payload])
        return {
          ...state,
          users: [...state.users,action.payload]
        };
      default:
        return state;
    }
  };
  