import{O as T,r as k,x as G,P as M,c as Q,G as H,d as c,o as y,e as N,f as e,h as n,w as a,z as h,k as A,g as f,F as K,n as W,q as z,t as I,A as B,y as O,Q as X,L as _,R as Y}from"./index-c2309140.js";const Z=["onClick"],le={__name:"index",setup(ee){let p=T(),v=k([]);G(()=>p.c3Id,()=>{v.value=[],p.c3Id&&b()});const b=async()=>{const{c1Id:r,c2Id:i,c3Id:g}=p;let s=await M(r,i,g);s.code==200&&(v.value=s.data)};let u=k(0),t=Q({attrName:"",attrValueList:[],categoryId:"",categoryLevel:3});const S=()=>{u.value=1,Object.assign(t,{attrName:"",attrValueList:[],categoryId:p.c3Id,categoryLevel:3})},$=r=>{u.value=1,Object.assign(t,JSON.parse(JSON.stringify(r)))},x=()=>{u.value=0};let V=k([]);const U=()=>{t.attrValueList.push({valueName:"",flag:!0}),O(()=>{V.value[t.attrValueList.length-1].focus()})},q=async()=>{(await X(t)).code==200?(u.value=0,_({type:"success",message:t.id?"修改成功":"添加成功"}),b()):_({type:"error",message:t.id?"修改失败":"添加失败"})},w=(r,i)=>{if(r.valueName.trim()==""){t.attrValueList.splice(i,1),_({type:"error",message:"属性值不能为空"});return}if(t.attrValueList.find(s=>{if(s!=r)return s.valueName===r.valueName})){t.attrValueList.splice(i,1),_({type:"error",message:"属性值不能重复"});return}r.flag=!1},D=(r,i)=>{r.flag=!0,O(()=>{V.value[i].focus()})},E=async r=>{(await Y(r)).code==200?(_({type:"success",message:"删除成功"}),b()):_({type:"error",message:"删除失败"})};return H(()=>{p.$reset()}),(r,i)=>{const g=c("Category"),s=c("el-button"),d=c("el-table-column"),P=c("el-tag"),j=c("el-popconfirm"),C=c("el-table"),L=c("el-input"),F=c("el-form-item"),J=c("el-form"),R=c("el-card");return y(),N("div",null,[e(g,{scene:n(u)},null,8,["scene"]),e(R,{style:{margin:"10px 0"}},{default:a(()=>[h(A("div",null,[e(s,{type:"primary",size:"default",icon:"Plus",disabled:!n(p).c3Id,onClick:S},{default:a(()=>[f(" 添加属性 ")]),_:1},8,["disabled"]),e(C,{border:"",style:{margin:"10px 0"},data:n(v)},{default:a(()=>[e(d,{label:"序号",type:"index",align:"center",width:"80px"}),e(d,{label:"属性名称",width:"120px",prop:"attrName"}),e(d,{label:"属性值名称"},{default:a(({row:l,$index:m})=>[(y(!0),N(K,null,W(l.attrValueList,(o,te)=>(y(),z(P,{key:o.id,style:{margin:"5px"}},{default:a(()=>[f(I(o.valueName),1)]),_:2},1024))),128))]),_:1}),e(d,{label:"操作",width:"120px"},{default:a(({row:l,$index:m})=>[e(s,{type:"primary",size:"small",icon:"Edit",onClick:o=>$(l)},null,8,["onClick"]),e(j,{title:`你确定删除${l.attrName}?`,width:"200px",onConfirm:o=>E(l.id)},{reference:a(()=>[e(s,{type:"primary",size:"small",icon:"Delete"})]),_:2},1032,["title","onConfirm"])]),_:1})]),_:1},8,["data"])],512),[[B,n(u)==0]]),h(A("div",null,[e(J,{inline:!0},{default:a(()=>[e(F,{label:"属性名称"},{default:a(()=>[e(L,{placeholder:"请你输入属性的名称",modelValue:n(t).attrName,"onUpdate:modelValue":i[0]||(i[0]=l=>n(t).attrName=l)},null,8,["modelValue"])]),_:1})]),_:1}),e(s,{type:"primary",size:"default",icon:"Plus",disabled:!n(t).attrName,onClick:U},{default:a(()=>[f(" 添加属性值 ")]),_:1},8,["disabled"]),e(s,{type:"primary",size:"default",onClick:x},{default:a(()=>[f("取消")]),_:1}),e(C,{border:"",style:{margin:"10px 0"},data:n(t).attrValueList},{default:a(()=>[e(d,{width:"80px",type:"index",algin:"center",label:"序号"}),e(d,{label:"属性值名称"},{default:a(({row:l,$index:m})=>[l.flag?(y(),z(L,{key:0,placeholder:"请你输入属性值名称",modelValue:l.valueName,"onUpdate:modelValue":o=>l.valueName=o,onBlur:o=>w(l,m),size:"small",ref:o=>n(V)[m]=o},null,8,["modelValue","onUpdate:modelValue","onBlur"])):(y(),N("div",{key:1,onClick:o=>D(l,m)},I(l.valueName),9,Z))]),_:1}),e(d,{label:"属性值操作"},{default:a(({row:l,index:m})=>[e(s,{type:"primary",size:"small",icon:"Delete",onClick:o=>n(t).attrValueList.splice(m,1)},null,8,["onClick"])]),_:1})]),_:1},8,["data"]),e(s,{type:"primary",size:"default",onClick:q,disabled:!(n(t).attrValueList.length>0)},{default:a(()=>[f(" 保存 ")]),_:1},8,["disabled"]),e(s,{type:"primary",size:"default",onClick:x},{default:a(()=>[f("取消")]),_:1})],512),[[B,n(u)==1]])]),_:1})])}}};export{le as default};
