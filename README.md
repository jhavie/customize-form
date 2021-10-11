# 组件的使用

## 传参

参数名 | 类型 | 是否必填 | 默认值 | 说明
------ | ---- | -------- | ------ | ----
data | Array | true | - | 用于显示form的显示及数据
showType | String | false | edit | 控制显示模式: 编辑模式(edit)、显示模式(review)

## 插槽

插槽名 | 类名 | 是否必填 | 说明
------ | ---- | -------- | ----
bottom | customize-form-bottom | false | 用于显示在表单底部，内部元素居中
top | customize-form-top | false | 用于显示在表单顶部，内部元素居中

## data配置项

配置项为对象类型，包含表单展示所必须的数据等集合

属性名 | 类型 | 是否必填 | 默认值 | 说明
------ | ---- | -------- | ------ | ----
formType | String | true | - | 服务项名称，用于定位配置信息
label | String | false | '' | 服务项显示名称
value | Any | false | - | 一般配置信息里有置空默认值
options | Array | 选择相关项必填 | - | 可供选择的列表
units | Array | 带单位相关项必填 | - | 同options, 用于显示单位
span | Number | false | - | 栏栅布局控制宽度，值为除以12的百分比值, 优先级>服务项>默认
props | Object/Array | false | - | 最终传入颗粒组件，如用的elementUI组件，则props就是这个组件对应的配置项，连体组件传入数组（待完善），高级组件（待完善）

## 操作钩子

1. getData: 获取数据;
2. saveData：保存当前数据;
3. resetData：重置数据;
4. lastData：恢复上次保存的数据;

## 代码示例

```vue
<cti-form
    :data="data"
    :type="showType"
    ref="node"
>
    <div slot="bottom" class="customize-form-bottom"></div>
    <div slot="top" class="customize-form-top"></div>
</cti-form>

data: [{
    formType: 'input',
    label: '输入框',
    value: 'test',
}, {
    formType: 'inputUnit',
    label: '带单位',
    units: ['平方米'],
    value: [[100, '平方米']],
}]
```

# 属性说明

## 基本属性

名称 | 类型 | 作用
---- | ---- | ----
formType | String | 类型
label | String ｜ 名称
defalut | Any ｜ 默认值
where | Function<config>: Boolean | 渲染标志
props | Object | 传入elementUI的控制项

## 特殊类型属性

### button

基本属性之上还包含

名称 | 类型 | 作用
---- | ---- | ----
event | String | 动作名称
click | function<config>: Any | 点击事件

## 高级类型属性

基本属性之上还包含

名称 | 类型 | 作用
---- | ---- | ----
length | Number | 渲染数组长度
list | Array | 基础类型的集合
btns ｜ Array ｜ 按钮类型的集合

### 高级组件传参

名称 | 类型 | 作用
---- | ---- | ----
props | Array | 适用于组件集合的每一项，配置根据formType划分
btnType | String | 按钮类型，现支持`add_delete`，属于预留配置项
itemProps | Object | 控制显示范围，如果控制宽度可用span替代

# 与后端约定项

约定组件名称及配置项。

## 单组件

名称 | 标识 | 说明
---- | ---- | ----
输入框 | input | -
选择框 | select | -
数字 | stepNumber | -
数字范围 | rangeNumber | -
单日期 | date | -
范围日期 | rangeDate | -
单时间 | time | -
范围时间 | rangeTime | -
标签 | multiSelect | -
图片 | image | -
多选框 | checkbox | -
文本域 | textarea | -

前缀含义：

    * range：范围
    * multi：多
    * step：记步

## 连体组件

单组件间按顺序用_(下划线)连接

    * 如: 客房数量(`stepNumber_unit`)
    * 如: 使用日期(`rangeDate_input_unit`)

## 高级联体组件

对于高级联动组件请使用`BIND_`开头

**高级连体组件**: 如第二个显示项会根据第一个显示项的变化而变化。

## 扩展性建议

考虑到扩展性，可根据命名区分组件参数

如:

```javascript
{
    // 组件名: select_select_input
    PROPS_select: [{
        options: ['鱼骨', '牛骨'],
        defaultValue: '鱼骨'
    }, {
        options: ['中国', '美国'],
        defaultValue: '美国'
    }],
    PROPS_input: [{
        placeholder: '默认文字',
    }],
}
```

# 服务项配置示例（cptCfg）

1. 适用日期(多个宽度配置): `{ "isAdd": "Y", "keyRule": "dateRange_price_unit_memo", "width": 12, "props": [{ "style": { "width": "240px" }, }, { "type": "number", "style": { "width": "90px" }, }, { "style": { "width": "90px" }, }, { "style": { "width": "150px" } }] }`
2. 协议价(通过zoom控制数值缩放倍率，适用价格): `{ "type":"number", "props": [{ "style": { "width": "150px" }, "zoom": 100 }, { "style": { "width": "90px" }, } ]}`
3. 最大容纳人数(通过precision控制精度，适用人数等): `{"props": {"min": 1,"precision": 0}}`
