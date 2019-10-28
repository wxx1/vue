<template>
    <a  class='item' 
        :class="{active:isActive}"
        >
        <div class='item-img'>
            <img :src='imgPath+listChildren.images[0]'/>
        </div>
        <div class='item-title'>{{listChildren.title}}</div>
    </a>
</template>

<script>
export default {
    data(){
        return {
           isActive: false
        }
    },
    props:{
        listChildren:{
            type:Object
        },
        index:Number,
        imgPath:String
    },
    methods:{
        handleClick(){
            this.isActive=!this.isActive
            // console.log(this.index)
            // this.isActive = this.listChildren.id === this.index?true:false
        }
    }
}
</script>

<style scoped>
    .item{
        display: flex;
        padding: 10px;
        font-size:15px;

    }
    .item :hover{
        cursor: pointer;
    }
    .active{
        background-color: bisque;
    }
    
    .item-img img{
        width:80px;
        height: 80px;;
    }
    .item-title{
        margin:3px 10px;
    }
</style>