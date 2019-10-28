<template>
    <div class="article">
        <div class="title">
            {{data.title}}
        </div>
        <div class='t-body' v-html="data.body"></div>

        <div class="comments" v-if='comments'>评论（{{comments.length}})
            <div class="comments-item"
                 v-for='item in comments'
                 :key='item.id'>
                 <div class="comments-avatar">
                     <img :src="imgPath+item.avatar"/>
                 </div>
                 <div class="comments-content">
                     <div class="comments-name">{{item.author}}</div>
                     <div class="comments-time">{{item.time}}</div>
                     <div class="comments-text">{{item.content}}</div>
                 </div>
            </div>
        </div>
    </div>
</template>
<script>
import {apiRequest} from '../network/request'
export default {
    
    data(){
        return {
            data:'',
            comments:''
        }
    },
    props:{
        id:Number,
        imgPath:String
    },
    mounted(){
        this.getArticle()
    },
    methods:{
        getArticle(){
            apiRequest({
                methods:'get',
                url:'news/'+this.id
            }).then((data) => {
                console.log(data)
                this.data=data.data
                this.getComment()
                window.scrollTo(0,0)
            })
        },
        getComment(){
            apiRequest({
                methods:'get',
                url:'story/'+this.id+'/short-comments'
            }).then((res) => {
                console.log(res)
                this.comments=res.data.comments
            })
        }
    },
    watch:{
        id(val){
            if(val){
                this.getArticle()
            }
        }
    }
}
</script>

<style>
    .title{
        font-size:28px;
        font-weight: bold;
        text-align: center;
        margin-top:30px;
        color: #222;
    }
    .t-body a{
        display: block;
        background:#f5f7f9;
        text-align: center;
        color:inherit;
        text-decoration: none;
        padding:4px 0;
        border-radius: 3px;
    }
    .comnents{
        margin: 10px 0;
    }
    .comments-item{
        border-bottom:1px dashed #ccc;
        padding:20px 0 30px 0;
        display: flex;
        font-size:20px;
    }
    .comments-avatar img{
        width:50px;
        height:50px;
        border-radius: 3px;
    }
    .comments-content{
        margin-left: 20px;
    }
    
    .comments-time{
        color:#9ea7b4;
        margin-top:10px;
        font-size:15px;
    }
    .comments-text{
        margin-top: 10px;
    }
</style>