let watchExampleVM = new Vue({
    el:'#watch-example',
    data:{
        question:'',
        answer:'I cannot give you an answer until you ask a question!'
    },
    watch:{
        question:function(newValue,oldValue){
            this.answer = 'Waiting for you to stop typing...';
            this.debouncedAnswer();
        }
    },
    created:function(){
        // `_.debounce` 是一个通过 Lodash 限制操作频率的函数。
        // 在这个例子中，我们希望限制访问 yesno.wtf/api 的频率
        // AJAX 请求直到用户输入完毕才会发出。
        this.debouncedAnswer = this.debounce(this.getAnswer,500)
    },
    methods:{
        getAnswer:function(){
            if (this.question.indexOf('?') === -1) {
                this.answer = 'Questions usually contain a question mark. ;-)'
                return
            }
            this.answer = 'Thinking...';
            let vm = this;
            axios.get('https://yesno.wtf/api')
              .then(function (response) {
                vm.answer = _.capitalize(response.data.answer)
              })
              .catch(function (error) {
                vm.answer = 'Error! Could not reach the API. ' + error
              })
        },
        debounce:function(fn,delayTime){
            let timeId;
            return function(){
                let context = this,
                    args = arguments;
                timeId && clearTimeout(timeId);
                timeId = setTimeout(function(){
                    fn.apply(context,args);
                },delayTime)
            }
        }
    }
})