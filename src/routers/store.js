/* ========================================================

    ** 全局Store **

    直接实例化，在 ./index.js 通过 Provider 渗透。
    在模块内用 @inject('Store')，将 Store 注入到 props 上。
    哪里用，哪里 @inject('Store')。

    注意：无论是全局 Store，还是局部 store，必须 @inject('xxx')注入到 props 上才能获取，保证结构的一致性。

   ====================================================== */
import { observable, action } from 'mobx'

class Store {
    @observable userInfo = {
        name : '',
        accountName : '',
        headUrl : '',
        id : '',
        role : '',
        sessionId : '',
        vip:''
    };
    @observable loading = false;
    @observable inwx = false;

    @action updateName = (res) => {
        this.userInfo.name = res.userName
        this.userInfo.accountName = res.accountName
        this.userInfo.headUrl = res.headUrl
        this.userInfo.id = res.id
        this.userInfo.role = res.role
        this.userInfo.sessionId = res.sessionId
        this.userInfo.vip = res.vip
    }
    @action updateLoading = (boolean) => {
        this.loading = boolean
    }
    @action updateInwx = (boolean) => {
        this.inwx = boolean
    }
}

export default new Store()