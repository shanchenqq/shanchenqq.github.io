import{K as p,r as g,D as N,c as x,d as i,o as T,e as I,f as e,w as t,g as u,t as O,h as d,k as S,B as y,L}from"./index-9dd9b327.js";const _={ALLPERMISSTION_URL:"/admin/acl/permission",ADDMENU_URL:"/admin/acl/permission/save",UPDATE_URL:"/admin/acl/permission/update",DELETEMENU_URL:"/admin/acl/permission/remove/"},$=()=>p.get(_.ALLPERMISSTION_URL),q=r=>r.id?p.put(_.UPDATE_URL,r):p.post(_.ADDMENU_URL,r),B=r=>p.delete(_.DELETEMENU_URL+r),z={class:"dialog-footer"},K={__name:"index",setup(r){let v=g([]);N(()=>{f()});const f=async()=>{let o=await $();o.code==200&&(v.value=o.data)};let s=g(!1),a=x({code:"",level:0,name:"",pid:0});const V=o=>{s.value=!0,Object.assign(a,{code:"",level:0,name:"",pid:0,id:0}),a.level=o.level+1,a.pid=o.id},R=o=>{s.value=!0,Object.assign(a,o)},D=async()=>{(await q(a)).code==200&&(s.value=!1,L({type:"success",message:a.id?"更新成功":"添加成功"}),f())},M=async o=>{(await B(o)).code==200&&(L({type:"success",message:"删除成功"}),f())};return(o,n)=>{const c=i("el-table-column"),m=i("el-button"),k=i("el-popconfirm"),A=i("el-table"),b=i("el-input"),U=i("el-form-item"),C=i("el-form"),P=i("el-dialog");return T(),I("div",null,[e(A,{style:{width:"100%","margin-bottom":"20px"},"row-key":"id",border:"",data:d(v)},{default:t(()=>[e(c,{label:"名称",prop:"name"}),e(c,{label:"权限值",prop:"code"}),e(c,{label:"修改时间",prop:"updateTime"}),e(c,{label:"操作"},{default:t(({row:l,$index:j})=>[e(m,{type:"primary",size:"small",disabled:l.level==4,onClick:E=>V(l)},{default:t(()=>[u(O(l.level==3?"添加功能":"添加菜单"),1)]),_:2},1032,["disabled","onClick"]),e(m,{type:"primary",size:"small",disabled:l.level==1,onClick:E=>R(l)},{default:t(()=>[u(" 编辑 ")]),_:2},1032,["disabled","onClick"]),e(k,{title:`你确定要删除${l.name}?`,width:"260px",onConfirm:E=>M(l.id)},{reference:t(()=>[e(m,{type:"danger",size:"small",disabled:l.level==1},{default:t(()=>[u(" 删除 ")]),_:2},1032,["disabled"])]),_:2},1032,["title","onConfirm"])]),_:1})]),_:1},8,["data"]),e(P,{modelValue:d(s),"onUpdate:modelValue":n[3]||(n[3]=l=>y(s)?s.value=l:s=l),title:d(a).id?"更新菜单":"添加菜单"},{footer:t(()=>[S("span",z,[e(m,{onClick:n[2]||(n[2]=l=>y(s)?s.value=!1:s=!1)},{default:t(()=>[u("取消")]),_:1}),e(m,{type:"primary",onClick:D},{default:t(()=>[u("确定")]),_:1})])]),default:t(()=>[e(C,null,{default:t(()=>[e(U,{label:"名称"},{default:t(()=>[e(b,{placeholder:"请你输入菜单名称",modelValue:d(a).name,"onUpdate:modelValue":n[0]||(n[0]=l=>d(a).name=l)},null,8,["modelValue"])]),_:1}),e(U,{label:"权限"},{default:t(()=>[e(b,{placeholder:"请你输入权限数值",modelValue:d(a).code,"onUpdate:modelValue":n[1]||(n[1]=l=>d(a).code=l)},null,8,["modelValue"])]),_:1})]),_:1})]),_:1},8,["modelValue","title"])])}}};export{K as default};
