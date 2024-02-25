<script setup>
const props = defineProps(['type','label','data'])

const type = (t) => {
    if(props.type == t) return true
}
</script>
<template>
    
<li v-if="type('text')" class="text-input">
<label :for="props.label">{{ props.label }} : </label>
<input :name="props.label" type="text" v-model="props.data" @input="$emit('update:data', $event.target.value)"/>
</li>

<li v-else-if="type('check')" class="switch">
    <input :id="props.label" type="checkbox" v-model="props.data" @change="$emit('update:data', $event.target.checked)"/>
    <label :for="props.label">
        <span>{{ props.label }} </span>
        <span></span>
    </label>
</li>
</template>
<style scoped>
li {
    padding: 5px;
}
.text-input label {
    display: inline-block;
    white-space: nowrap;
    padding-right: 10px;
    text-align: right;
    text-transform: capitalize;
    font-weight: bold;
}
[type="checkbox"] {
  position: absolute;
  left: -9999px;
}
.switch label{
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
}
.switch span:first-child{
    padding-right: 20px;
    font-weight: bold;
}
.switch span:last-child{
    position: relative;
    width: 50px;
    height: 26px;
    border-radius: 15px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.4);
    background: grey;
    transition: all 0.3s;
}
.switch span:last-child::before,
.switch span:last-child::after {
  content: "";
  position: absolute;
}
.switch span:last-child::before {
  left: 1px;
  top: 1px;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  z-index: 1;
  transition: transform 0.3s;
}
.switch span:last-child::after {
  top: 50%;
  right: 8px;
  width: 12px;
  height: 12px;
  transform: translateY(-50%);
  background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/uncheck-switcher.svg);
  background-size: 12px 12px;
}
.switch [type="checkbox"]:checked + label span:last-child {
  background: #47745c;
}
.switch [type="checkbox"]:checked + label span:last-child::before {
  transform: translateX(24px);
}
.switch [type="checkbox"]:checked + label span:last-child::after {
  width: 14px;
  height: 14px;
  left: 8px;
  background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/checkmark-switcher.svg);
  background-size: 14px 14px;
}
</style>