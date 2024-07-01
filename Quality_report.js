export default {
    data() {
        return {
            //整合数据
            // messages: JSON.parse(localStorage.getItem('messages')),
            messages: '',
            n: -1, //用来表示messages索引
            keys: ['course', 'nature', 'mid', 'end', 'semester', 'credit'],
            timer: 0, //进度条
            pick: 'good', //单选框决定addInfo.e的取值
            //额外数据
            addInfo: {
                start: '根据南通市教育局通知精神，我校决定于2024年6月26日至2024年9月7日放假，下学期于2024年9月8日报到注册。',
                e: '',
                g: '',
                teacher: '',
            },
            isComments: false, //判断是否上传了评语表
            // info: '👇🏻先点击获取整合数据,再点击开始制作', //获取整合数据按钮的交互
            isAutomaticSort: true, //默认自动排序
        }
    },
    methods: {
        handleFile(e) {
            // console.log(e.type)
            let files
            if (e.type === 'drop') {
                e.stopPropagation()
                //https://www.jianshu.com/p/6e921d7680ac
                //chrome浏览器的drop事件的默认行为是打开被放到放置目标上的URL。为了让chrome支持正常的拖放，还要取消drop事件的默认行为
                e.preventDefault()
                files = e.dataTransfer.files
            } else if (e.type === 'change') {
                files = e.target.files
            }
            // console.log(files)
            // debugger

            let file1, file2, file3, file4, file5, file6, file7
            for (let i = 0; i < files.length; i++) {
                const type = files[i].name.split('.')

                //兼容360浏览器
                //校验拖入文件是否合法
                // if (type.at(-1) !== 'xlsx' && type.at(-1) !== 'xls') {
                if (type[1] !== 'xlsx' && type[1] !== 'xls') {
                    alert('只能选择后缀名是xlsx或者xls的Excel文件拖入')
                    return
                }
                //把数据分类保存
                // if (type.at(0).includes('成绩')) {
                //     file1 = files[i]
                // } else if (type.at(0).includes('学分')) {
                //     file2 = files[i]
                // } else if (type.at(0).includes('评语')) {
                //     file3 = files[i]
                // } else if (type.at(0).includes('追加')) {
                //     file4 = files[i]
                // } else if (type.at(0).includes('学生')) {//22××班学生信息表
                //     file5 = files[i]//新生江苏省学籍库信息导入
                // } else if (type.at(0).includes('补充')) {
                //     file6 = files[i]//新生江苏省学籍库信息导入
                // } else if (type.at(0).includes('专业')) {//2022级班级及专业信息表
                //     file7 = files[i]//新生江苏省学籍库信息导入
                // }
                if (type[0].includes('成绩')) {
                    file1 = files[i]
                } else if (type[0].includes('学分')) {
                    file2 = files[i]
                } else if (type[0].includes('评语')) {
                    file3 = files[i]
                } else if (type[0].includes('追加')) {
                    file4 = files[i]
                } else if (type[0].includes('学生')) {
                    //22××班学生信息表
                    file5 = files[i] //新生江苏省学籍库信息导入
                } else if (type[0].includes('补充')) {
                    file6 = files[i] //新生江苏省学籍库信息导入
                } else if (type[0].includes('专业')) {
                    //2022级班级及专业信息表
                    file7 = files[i] //新生江苏省学籍库信息导入
                }
            }
            // console.log(file7)
            // debugger
            // getExcelPlus(file7)
            //     .then(value => console.log(value))
            //     .catch(error => console.log(error))
            // debugger

            console.log(this.isAutomaticSort) //回调函数内部访问不到this
            let isAutomaticSort = this.isAutomaticSort
            function getExcelPlus(file, unPlus = true) {
                return new Promise(function (resolve, reject) {
                    const reader = new FileReader()
                    //https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader/readAsBinaryString
                    reader.readAsArrayBuffer(file)
                    reader.onload = function (e) {
                        let fdata = e.target.result
                        fdata = new Uint8Array(fdata)

                        const workbook = XLSX.read(fdata, { type: 'array' })

                        const SheetNames = workbook.SheetNames
                        const worksheet = workbook.Sheets[SheetNames[0]]

                        //https://blog.csdn.net/weixin_43817709/article/details/103754546
                        const sheetOptions = {
                            /** Default value for null/undefined values */
                            defval: '', //给defval赋值为空的字符串
                        }

                        const data = XLSX.utils.sheet_to_json(
                            worksheet,
                            sheetOptions,
                        )
                        if (unPlus) {
                            resolve(data)
                        } else {
                            //处理成绩file1
                            data.shift()
                            const headers = [
                                '学生成绩表',
                                '__EMPTY',
                                '__EMPTY_1',
                                '__EMPTY_2',
                                '__EMPTY_3',
                                '__EMPTY_4',
                                '__EMPTY_5',
                                '__EMPTY_6',
                                '__EMPTY_7',
                                '__EMPTY_8',
                                '__EMPTY_9',
                                '__EMPTY_10', //课程性质
                                '__EMPTY_13',
                                '__EMPTY_15',
                                '__EMPTY_12',
                                '__EMPTY_11', //学分
                            ]
                            //将data中的每一项(对象)按数组headers中值的顺序转变成数组
                            let aoa = data.map(obj =>
                                headers.map(head => obj[head]),
                            )
                            // console.log(aoa)
                            // debugger
                            // console.log(aoa[0])
                            // console.log(aoa[0][8])//学生姓名

                            let res
                            // console.log(this.isAutomaticSort)//回调函数内部访问不到this
                            if (isAutomaticSort) {
                                console.log('20230511自定排序科目')
                                //20230511自定排序科目
                                res = aoa.reduce((prev, next) => {
                                    let index = prev.findIndex(elem => {
                                        return next[8] === elem[0][8]
                                    })
                                    if (index === -1) {
                                        prev.push([next])
                                    } else {
                                        prev[index].push(next)
                                    }
                                    return prev
                                }, [])
                                // console.log(res)
                                // debugger
                                res.forEach(item => {
                                    item.sort((a, b) =>
                                        a[10].localeCompare(b[10]),
                                    )
                                })
                                // console.log(res)
                                // debugger
                                aoa = res.flat()
                            }
                            //合并姓名相同的学生成绩信息
                            res = aoa.reduce((prev, next) => {
                                let index = prev.findIndex(elem => {
                                    return next[8] === elem[8]
                                })
                                if (index === -1) {
                                    return prev.concat([next])
                                } else {
                                    prev[index] = prev[index].concat(
                                        next.slice(10),
                                    )
                                    return prev
                                }
                            }, [])
                            // console.log(res)
                            // debugger

                            resolve(res)
                        }
                    }
                })
            }

            //素质评价报告
            if (file1 && file2) {
                //中职班评语一年一次,高职班一年两次
                const promise1 = getExcelPlus(file1, false) //成绩
                const promise2 = getExcelPlus(file2) //学分
                const promise3 = getExcelPlus(file3) //评语
                const promise4 = getExcelPlus(file4) //追加
                Promise.allSettled([
                    promise1,
                    promise2,
                    promise3,
                    promise4,
                ]).then(v => {
                    console.log(v)
                    // console.log(v[3].status)//有追加返回'fulfilled' 没有追加返回'rejected'
                    // console.log(v[2].status)//有评语返回'fulfilled' 没有评语返回'rejected'
                    // debugger

                    //temp用来收集所需数据
                    const temp = []
                    v[0].value.forEach((arr, index) => {
                        temp[index] = { 姓名: arr[8] }
                    })
                    // console.log(temp)
                    // debugger
                    //德育学分表取德育总分和操行等第数据(建议在德育学分表的操行等第这一列右侧增加一列"职务")
                    temp.forEach(obj => {
                        v[1].value.forEach(obj2 => {
                            if (obj.姓名 === obj2.姓名) {
                                obj.德育总分 = obj2.德育总分
                                obj.操行等第 = obj2.操行等第
                                obj.职务 = obj2.职务
                            }
                        })
                    })
                    // console.log(temp)
                    // debugger
                    //评语表取评定评语和班主任数据
                    if (v[2].status === 'fulfilled') {
                        //因为可选,所以判断
                        temp.forEach(obj => {
                            v[2].value.forEach(obj1 => {
                                if (obj.姓名 === obj1.姓名) {
                                    obj.评定评语 = obj1.评定评语
                                    obj.班主任 = obj1.班主任
                                }
                            })
                        })
                        this.isComments = true //有上传评语表
                    } else {
                        this.isComments = false //没有上传评语表
                    }
                    // console.log(temp)
                    // debugger
                    //追加表取非学号、姓名、班级的数据
                    if (v[3].status === 'fulfilled') {
                        //因为可选,所以判断
                        temp.forEach(obj => {
                            v[3].value.forEach(obj3 => {
                                if (obj.姓名 === obj3.姓名) {
                                    for (const key in obj3) {
                                        if (
                                            !['学号', '姓名', '班级'].includes(
                                                key,
                                            )
                                        )
                                            obj[key] = obj3[key]
                                    }
                                }
                            })
                        })
                    }
                    // console.log(temp)
                    // debugger

                    //将temp汇总的数据交给成绩表
                    v[0].value.forEach(arr => {
                        temp.forEach(obj => {
                            if (arr[8] === obj.姓名) {
                                arr.splice(9, 0, obj)
                            }
                        })
                    })
                    // console.log(v[0].value[0])
                    // debugger

                    // localStorage.setItem('messages', JSON.stringify(v[0].value))
                    this.messages = v[0].value
                })
                return
            }

            //新生信息辅助表
            if (file5 && file6 && file7) {
                const promise5 = getExcelPlus(file5) //学生
                const promise6 = getExcelPlus(file6) //补充
                const promise7 = getExcelPlus(file7) //专业
                Promise.allSettled([promise5, promise6, promise7]).then(v => {
                    // console.log(v)
                    // console.log(v[0].status)//有返回'fulfilled' 没有追加返回'rejected'
                    // console.log(v[2].value)
                    // debugger

                    //整合file5、file6
                    let data = v[0].value,
                        data1 = v[1].value,
                        data2 = v[2].value
                    data.pop() //去掉合计这一行
                    data1.shift() //去掉提示这一行,原表第一行'2023新生信息表'要先删掉
                    console.log(data)
                    // debugger
                    console.log(data1)
                    // debugger

                    data.forEach((obj0, index) => {
                        data1.forEach(obj1 => {
                            //2023年'考生姓名'改成了'姓名'
                            if (obj0.姓名 === obj1.姓名) {
                                delete obj1.姓名
                                //forEach下修改原数组需要使用data[index],而不能是obj0
                                data[index] = { ...obj0, ...obj1 } //data[index]=Object.assign(obj1)
                            }
                        })
                    })
                    // console.log(data)
                    // debugger

                    //根据'班级'在data2中找到'班级名称'对应的'专业简称'
                    // console.log(data[0].班级)
                    const className = data[0].班级
                    let professionalName
                    data2.forEach(v => {
                        if (v.班级名称 === className)
                            professionalName = v.专业简称
                    })
                    // console.log(professionalName)
                    // debugger

                    //按新生信息完善模板.xls排序数据,亟待核对默认值设定
                    const aoa = data.map(obj => [
                        obj.姓名, //2023年'考生姓名'改成了'姓名'
                        obj.性别,
                        '', //出身日期批量自动生成
                        '居民身份证',
                        obj.身份证号码, //2023年'身份证号'改成了'身份证号码'
                        (obj.学号 + '').slice(0, 4) + '0901', //入学年月20230901
                        professionalName, //专业名称就是从2023级班级及专业信息表中获取的'专业简称'
                        '', //专业方向可选填
                        '学制if8', //学制 从22年招生处表中的学制填三年制或五年制
                        '', //姓名拼音批量自动生成
                        '汉族', //民族默认值
                        '中国', //国籍/地区默认值
                        '', //港澳台侨外批量自动生成
                        '', //出生地行政区划码批量自动生成
                        '', //籍贯地行政区划码批量自动生成
                        '', //户口所在地行政区划码批量自动生成
                        obj.户口性质, //需采集
                        obj.户口性质 === '农业户口'
                            ? '农村'
                            : obj.学生居住地类型, //需采集 农业户口对应农村;非农业户口对应城市、乡镇非农或县城
                        obj.户口所在地区县以下详细地址, //需采集
                        obj.所属派出所, //需采集
                        obj.乘火车区间 || '无', //需采集
                        obj.政治面貌, //需采集
                        '未婚', //婚姻状况默认值
                        obj.健康状况, //需采集
                        obj.是否建档立卡贫困家庭, //需采集
                        obj.联系电话, //需采集
                        '应届', //学生来源默认值
                        '应届初中毕业生', //招生对象默认值
                        '否', //来自军队默认值
                        '否', //是否随迁子女默认值
                        obj.毕业初中校名称, //2023年'毕业学校'改成了'毕业初中校名称'
                        '', //生源地行政区划码批量自动生成
                        '统一招生', //招生方式  需跟学生确认可能为自主招生 不是参加南通大市中考的就是外地生,外地生选自主招生,不用填考生号和准考证号的
                        '注册入学if33', //只有三年中专填是,其他为否
                        '统一招生考试/普通入学', //入学方式
                        '是', //是否为第一志愿
                        obj.准考证号 || obj.考生号, //准考证号填考生号
                        obj.考生号, //考生号
                        obj.中考分数, //2023年'分数'改成了'中考分数'
                        '', //招生信息选填项
                        '', //招生信息选填项
                        '', //招生信息选填项
                        '', //招生信息选填项
                        obj.班级, //班级名称
                        obj.学号, //学号
                        '学生类别if45', //学生类别填五年制高职学生或普通中专学生  5+2本科算五年制高职学生
                        '全日制', //学习形式默认值
                        obj.是否住校 === '否' ? '走读' : '住校', //就读方式 2023年'是否住宿'改成了'是否住校'
                        '分段培养方式if48',
                        '内地中职班', //专项招生类型默认值
                        '非联合办学', //联招合作类型默认值
                        '', //联招合作学生为必填
                        '', //联招合作学生为必填
                        '', //校外教学点的学生为必填
                        '', //英文姓名
                        '', //电子邮箱/其他联系方式
                        obj.家庭现住址, //2023年'家庭住址'改成了'家庭现住址'
                        '', //家庭邮政编码
                        '', //家庭电话
                        obj.第一监护人姓名, //成员1姓名
                        obj.与第一监护人关系, //成员1关系
                        '是', //成员1是否监护人默认值
                        obj.第一监护人联系电话, //成员1联系电话
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        obj.第二监护人姓名, //成员2姓名
                        obj.与第二监护人关系, //成员2关系
                        '是', //成员2是否监护人默认值
                        obj.第二监护人联系电话, //成员2联系电话
                    ])

                    //处理学制if8、学生类别if45、分段培养方式if48、注册入学if33
                    for (const [key, obj] of data.entries()) {
                        let arr = aoa[key]
                        //2023年招生处表中的学制的值有四种:3+3大专、本科、三年制中专、五年制大专
                        //学制if8、学生类别if45
                        if (
                            ['三年制中专', '3+3大专', '本科'].includes(
                                obj.录取学历, //2023年'学制'改成了'录取学历'
                            )
                        ) {
                            arr[8] = '三年制'
                            arr[45] = '普通中专学生'
                        } else if (['五年制大专'].includes(obj.录取学历)) {
                            arr[8] = '五年制' //学制if8
                            arr[45] = '五年制高职学生' //学生类别if45
                        }
                        //分段培养方式if48
                        arr[48] =
                            obj.录取学历 === '三年制中专'
                                ? '非分段培养'
                                : obj.录取学历 === '3+3大专'
                                ? '中高职3+3(含卫生类4+2)'
                                : obj.录取学历 === '本科'
                                ? '中职本科3+4'
                                : ['五年制大专'].includes(obj.录取学历)
                                ? '五年一贯制'
                                : ''

                        //注册入学if33
                        arr[33] = obj.录取学历 === '三年制中专' ? '是' : '否'
                    }
                    //测试
                    // console.log(aoa[0])
                    // console.log(aoa[0][8]) //学制
                    // console.log(aoa[0][43]) //班级
                    // console.log(aoa[0][44]) //学号
                    // console.log(aoa[0][45]) //学生类别
                    // console.log(aoa[0][47]) //就读方式
                    // console.log(aoa[0][48]) //分段培养方式
                    // debugger

                    //输出整理好的数据Excel
                    function exportExcel(aoa) {
                        //创建worksheet
                        const ws = XLSX.utils.aoa_to_sheet(aoa)
                        //设置每列的列宽，10代表10个字符，注意中文占2个字符
                        // ws['!cols'] = [
                        //     { wch: 10 },
                        //     { wch: 30 },
                        //     { wch: 25 },
                        // ]
                        //创建workbook
                        const wb = XLSX.utils.book_new()
                        //生成xlsx文件(book,sheet数据,sheet命名)
                        XLSX.utils.book_append_sheet(wb, ws, '列表详情')
                        //写文件(workbook,xlsx文件名称)
                        //工作簿文件属性Props
                        XLSX.writeFile(
                            wb,
                            `${aoa[0][43].slice(0, 4)}辅助表.xlsx`,
                            {
                                Props: {
                                    Author: '南通中专单晨',
                                    Title: '这些情话不说了也罢',
                                    Subject: '就让花儿替我陪着你吧',
                                    Keywords: '不怪老天要收回我的芳华',
                                    Category: '就当今生和你相遇的代价',
                                    Comments: '我的脚步已经走不动啦',
                                },
                            },
                        )
                    }
                    exportExcel(aoa)
                })
                return
            }

            if (!(file1 && file2) || !(file5 && file6 && file7)) {
                alert(`
                        如果您想制作素质报告单请上传必需的成绩表、德育学分表、<评语表(可选)、追加表(可选)>!!!
                        如果您制作新生江苏省学籍库信息导入请上传必需的学生信息表、补充信息表~~~`)
                return
            }
        },

        //获取整合数据messages
        fetchMessages() {
            // this.messages = JSON.parse(localStorage.getItem('messages'))
            console.log(this.messages)

            console.log(this.isComments)
            // show.style.visibility = 'visible'
            show.style.display = 'block'

            this.info = this.messages
                ? '获取整合数据成功~'
                : '获取整合数据失败,请回到第一步选取或者拖入相关Excel表'
        },

        //开关
        initiate() {
            if (!this.messages) {
                alert(`请先获取整合数据`)
                return
            }
            this.timer = setInterval(() => {
                if (this.n <= this.messages.length - 1) this.n++
                else clearInterval(this.timer) //this.n等于this.messages.length-1时最后一次自增
            }, 200)
        },

        loadFile(url, callback) {
            //chrome浏览器设置跨域
            //https://blog.csdn.net/oscar999/article/details/124114343
            // --allow-file-access-from-files
            //edge浏览器设置跨域(chrome也适用)
            //https://juejin.cn/post/7114185715893665800?share_token=7e800f94-c6b9-4bdd-b831-d29768d64726
            // --args --disable-web-security --user-data-dir=E:\Cache
            // --disable-web-security --user-data-dir=E:\Cache
            //先打开设置好跨域的浏览器快捷方式,再把html拖进去
            //火狐浏览器设置跨域
            //https://blog.csdn.net/qq_43592064/article/details/118903001
            PizZipUtils.getBinaryContent(url, callback)
        },
        generate(msg, rec, add) {
            let str = this.isComments ? 'high1.docx' : 'low1.docx'
            this.loadFile(str, function (error, content) {
                //抛出读取错误
                if (error) {
                    throw error
                }

                var zip = new PizZip(content)
                //https://docxtemplater.com/docs/configuration/#paragraphloop
                //https://docxtemplater.com/docs/configuration/#linebreaks
                var doc = new docxtemplater(zip, {
                    paragraphLoop: true,
                    linebreaks: true,
                    //https://juejin.cn/post/7094139413248081928
                    nullGetter: function () {
                        return ''
                    },
                })

                //要填充的数据
                doc.setData({
                    ...rec, //成绩
                    ...add, //额外数据

                    ...msg[9], //
                    // comments: msg[9].评定评语,
                    // moral: msg[9].德育总分,
                    // conduct: msg[9].操行等第,
                    // position: msg[9].职务,
                    // teacher: msg[9].班主任,
                    //从成绩表中获取以下5项数据,因为评语表(包含以下5项数据)可能不上传,所以从msg[9]中获取以下数据会产生问题
                    time: msg[0], //msg[9].学年
                    num: msg[1], //msg[9].学期
                    class: msg[5], //msg[9].班级
                    name: msg[8], //msg[9].姓名//学分表中含有的
                    id: msg[7], //msg[9].学号//学分表中含有的

                    department: msg[2], //从成绩表中获取系部
                })
                try {
                    doc.render()
                } catch (error) {
                    //https://docxtemplater.com/docs/errors/#handling-multiple-errors
                    //https://juejin.cn/post/7026337152044630047
                    let e = {
                        message: error.message,
                        name: error.name,
                        stack: error.stack,
                        properties: error.properties,
                    }
                    console.log(JSON.stringify({ error: e }))
                    throw error
                }

                var out = doc.getZip().generate({
                    type: 'blob',
                    mimeType:
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    //https://docxtemplater.com/docs/faq/#generate-smaller-docx-using-compression
                    compression: 'DEFLATE',
                })

                //https://www.hangge.com/blog/cache/detail_1795.html
                //你真的会用<a>标签下载文件吗? https://juejin.cn/post/7246747232997720120
                //聊一聊 15.5K 的 FileSaver，是如何工作的？https://juejin.cn/post/6901790184841412622
                //需要自己设置好浏览器保存文件的位置
                saveAs(out, `${msg[5]} ${msg[7]} ${msg[8]}.docx`)
            })
        },
    },
    watch: {
        n(newValue) {
            // if (!this.messages) {
            // alert(`请先获取数据`)
            // return
            // }
            if (this.n === this.messages.length) {
                alert(`为您节省下来的每一秒都会使我快乐!`)
                return
            }

            const message = this.messages[newValue]
            const record = {}
            for (let j = 11; j <= 16; j++) {
                for (let i = 1; i <= 12; i++) {
                    record[this.keys[j - 11] + i] = message[j + (i - 1) * 6]
                }
            }
            this.generate(message, record, this.addInfo)
        },

        // addInfo: {
        //     handler: function (newValue, oldValue) {
        //         // console.log(newValue, oldValue)
        //         newValue.e === '√' ? newValue.g = '' : newValue.g = '√'
        //     },
        //     deep: true
        // }
        pick: {
            handler: function (newValue, oldValue) {
                //方括号开头要➕分号
                // console.log(this.pick)
                // try {
                //     [this.addInfo.g, this.addInfo.e] = newValue === 'good' ? ['√', ''] : ['', '√']
                // } catch (error) {
                //     console.log(error)
                // }
                /* ;[this.addInfo.g, this.addInfo.e] =
                    newValue === 'good' ? ['√', ''] : ['', '√'] */

                /* console.log([this.addInfo.g, this.addInfo.e])
                console.log(window.devicePixelRatio) */
                // if (window.devicePixelRatio != 1.3) {
                //     document.body.style.zoom = 1.3
                // }
            },
            immediate: true,
        },

        isAutomaticSort: {
            handler: function (newValue, oldValue) {
                console.log(typeof newValue)
                console.log(newValue)
            },
            immediate: true,
        },
    },
}
