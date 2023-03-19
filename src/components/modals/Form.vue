<script setup>
const props = defineProps(['type','label','data'])

const type = (t) => {
    if(props.type == t) return true
}
</script>
<template>
    
<li v-if="type('text')">
<label :for="props.label">{{ props.label }} : </label>
<input :name="props.label" type="text" v-model="props.data" @input="$emit('update:data', $event.target.value)"/>
</li>
</template>
<style scoped>
li {
    padding: 5px;
}
label {
    display: inline-block;
    width: 120px;
    white-space: nowrap;
    padding-right: 10px;
    text-align: right;
    text-transform: capitalize;
    font-weight: bold;
}
</style>