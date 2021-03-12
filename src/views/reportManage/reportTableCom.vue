<template>
  <div class="">
    <el-table :data="tableData"  border>
      <el-table-column v-for="(item,key) in tableKey"
      v-if="!item.special"
      :key="key"
      :show-overflow-tooltip="true"
      :prop="item.value"
      :label="item.name"
      :width="item.width"
      :class-name="item.classname"></el-table-column>
      <el-table-column v-else
      :label="item.name"
      :width="item.width">
        <template slot-scope="scope">
          <slot :name="item.value" :$index="scope.$index" :row="scope.row"></slot>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default{
  name: 'report-table-list',
  data () {
    return {
    }
  },
  methods: {
  },
  props: ['tableData', 'tableKey', 'searchShow']
}
</script>

<style>
</style>
