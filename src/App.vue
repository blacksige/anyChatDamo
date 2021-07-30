<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view/>
  </div>
</template>

<style lang="less">
html body{
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
}
.btn-style{
  cursor: pointer;
  width: 80px;
  height: 40px;
  background-color: #409EFF;
  color: aliceblue;
  border-radius: 5px;
  border: none;
  &:hover{
    background-color: #4053ff;
  }
}

</style>