
const reducer = (state,action) => {

    if(action.type === 'user'){
           return action.payload;
       }

    return state;
   
}

export default reducer;