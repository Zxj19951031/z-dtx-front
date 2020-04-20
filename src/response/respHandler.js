import ElementUI from 'element-ui'

export default {
    handleResponse: function (response) {
        const code = response.data.code
        const msg = response.data.message
        if (code === 200) {
            ElementUI.Message({
                message: msg,
                type: 'success'
            });
        } else {
            ElementUI.Message({
                message: msg,
                type: "error"
            })
        }
    }
}