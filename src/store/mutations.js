import { SHOWLOADING,HIDELOADING } from './mutations-types'

const state = {
  showLoading:false,
  userInfo: '',
  editDs: ''
};

const mutations = {
  SHOWLOADING:(state)=>{
    state.showLoading = true;
  },
  HIDELOADING:(state)=>{
    state.showLoading = false;
  }
};



export default {
  state,mutations
}  