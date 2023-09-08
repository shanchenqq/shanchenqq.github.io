export default {
    data() {
        return {
            messages: '', //存储整合数据
            courseNameObj: {},
            courseNames_required: [],
            courseNames_no_required: [],

            n: -1, //用来表示messages索引
            timer: 0, //进度条
            pick: 'high',
            value: 'none', //控制修改课程名称显示与隐藏
            //额外数据
            addInfo: {},
            info: '👇🏻先点击检查整合数据,再点击开始制作',
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

            let file8, file9, file10, file11, file12, file13, file14
            for (let i = 0; i < files.length; i++) {
                const type = files[i].name.split('.')

                //兼容360浏览器
                //校验拖入文件是否合法
                // if (type[1] !== 'xlsx' && type[1] !== 'xls') {
                //     alert('只能选择后缀名是xlsx或者xls的Excel文件拖入')
                //     return
                // }
                if (type[0].includes('学期成绩总表')) {
                    file8 = files[i]
                } else if (type[0].includes('学籍信息收集表')) {
                    file9 = files[i]
                } else if (type[0].includes('第一学年评语')) {
                    file10 = files[i]
                } else if (type[0].includes('第二学年评语')) {
                    file11 = files[i]
                } else if (type[0].includes('第三学年评语')) {
                    file12 = files[i]
                } else if (type[0].includes('第四学年评语')) {
                    file13 = files[i]
                } else if (type[0].includes('第五学年评语')) {
                    file14 = files[i]
                }
            }

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
                            // console.log(data)
                            // debugger
                            data.shift() //去掉第一行标题行
                            const headers = [
                                '学生成绩表', //学年
                                '__EMPTY', //学期
                                // '__EMPTY_1',//学院
                                // '__EMPTY_2',//专业
                                // '__EMPTY_3',//年级
                                // '__EMPTY_4',//班级
                                // '__EMPTY_5',//学制
                                // '__EMPTY_6',//学号
                                '__EMPTY_7', //姓名
                                // '__EMPTY_8',//课程代码
                                '__EMPTY_9', //课程名称
                                '__EMPTY_10', //课程性质
                                // '__EMPTY_13',//期中成绩
                                // '__EMPTY_15',//期末成绩
                                '__EMPTY_12', //学期成绩
                                '__EMPTY_11', //学分
                                // '__EMPTY_16',//实践成绩
                            ]
                            //将data中的每一项(对象)按headers的顺序转变成数组
                            let aoa = data.map(obj =>
                                headers.map(head => obj[head]),
                            )
                            // console.log(aoa)
                            // console.log(aoa[0])
                            // console.log(aoa[0][8])//学生姓名
                            // debugger
                            //合并姓名相同的学生成绩信息
                            aoa = aoa.map(arr =>
                                arr.map(item => item.replaceAll(' ', '')),
                            ) //去空格
                            const res = aoa.reduce((prev, next) => {
                                let index = prev.findIndex(elem => {
                                    return next[2] === elem[0][2]
                                })
                                if (index === -1) {
                                    prev.push([next])
                                } else {
                                    prev[index].push(next)
                                }
                                return prev
                            }, [])
                            resolve(res)
                        }
                    }
                })
            }

            if (file8 && file9 && file10 && file11 && file12) {
                const promise8 = getExcelPlus(file8, false) //学期成绩总表
                const promise9 = getExcelPlus(file9) //学籍信息收集表
                const promise10 = getExcelPlus(file10) //第一学年评语
                const promise11 = getExcelPlus(file11) //第二学年评语
                const promise12 = getExcelPlus(file12) //第三学年评语
                // let promise13, promise14
                // if (this.pick === 'high') {
                //     promise13 = getExcelPlus(file13)//第四学年评语
                //     promise14 = getExcelPlus(file14)//第五学年评语
                // }
                const promise13 = getExcelPlus(file13) //第四学年评语
                const promise14 = getExcelPlus(file14) //第五学年评语
                Promise.allSettled([
                    promise8,
                    promise9,
                    promise10,
                    promise11,
                    promise12,
                    promise13,
                    promise14,
                ]).then(v => {
                    // console.log(v)
                    // debugger
                    // console.log(v[0].status)//成功返回'fulfilled' 失败返回'rejected'

                    //学籍信息收集表
                    // console.log(v[1].value)
                    //temp用来按照学籍信息收集表的姓名顺序收集所需数据
                    const temp = []
                    v[1].value.forEach((obj, index) => {
                        temp[index] = {
                            姓名: obj.姓名,
                            学号: obj.学号,
                            学年评语: {},
                        }
                    })
                    // console.log(temp)
                    // debugger

                    //处理学年评语
                    // console.log(v[2].value)
                    // debugger
                    const v23456 = [v[2], v[3], v[4], v[5], v[6]].map(
                        elem => elem.value,
                    )
                    // console.log(v23456)
                    // debugger
                    temp.forEach(obj1 => {
                        v23456.forEach((v, i) => {
                            //中职情况下v[5]、v[6]是undefined,所以加可选链?
                            v?.forEach(obj2 => {
                                //增补学生名单会出现单元格的数字导出字符串的问题,所以使用双等号达到隐式类型转换
                                if (obj1.学号 == obj2.学号) {
                                    obj1.学年评语[`第${i + 1}学年评语`] =
                                        obj2.评定评语
                                    obj1.学年评语[`第${i + 1}学年操行`] =
                                        obj2.操行等第
                                    obj1.学年评语.班主任 ??= obj2.班主任
                                }
                            })
                        })
                    })
                    // console.log(temp)
                    // debugger

                    //处理学期成绩总表
                    const end = new Date().getFullYear()
                    // const end = 2024
                    const schoolYear = []
                    let i = this.pick === 'high' ? 5 : 3
                    while (i >= 1) {
                        schoolYear.push(
                            `${end - i}-${end - (i - 1)}_1`,
                            `${end - i}-${end - (i - 1)}_2`,
                        )
                        i--
                    }
                    // console.log(schoolYear)
                    // debugger
                    // console.log(v[0].value)
                    // debugger
                    //将每个人的10个学期的成绩数组arr按学期顺序分类
                    let v0 = v[0].value.map(arr => {
                        const result =
                            this.pick === 'high'
                                ? [[], [], [], [], [], [], [], [], [], []]
                                : [[], [], [], [], [], []]
                        let index
                        arr.forEach(item => {
                            index = schoolYear.indexOf(`${item[0]}_${item[1]}`)
                            result[index].push(item)
                        })
                        return result
                    })
                    // console.log(v0)
                    // debugger
                    //对每个人每学期的课程排序
                    v0.forEach(res => {
                        res.forEach(item => {
                            item.sort((a, b) => a[3].localeCompare(b[3]))
                        })
                    })
                    // console.log(v0[0])
                    // console.log(v0[1])
                    // debugger

                    //删除没有成绩或学分的课程,删除同一学期同名课程并取分数高的
                    let courseNames_required = new Set()
                    let courseNames_no_required = new Set()
                    v0.forEach(res => {
                        // console.log(res)//res是某人按学期顺序分类的10个学期的成绩
                        // debugger
                        res.forEach(item => {
                            // console.log(item)//item是某人1个学期的成绩
                            // debugger
                            const temp = new Set()
                            for (let i = 0; i < item.length; i++) {
                                const v = item[i]
                                // console.log(v)//['2021-2022', '1', '杨佳美', '钢琴基础', '必修课', '64', '2']
                                // debugger
                                if (v[4] === '必修课') {
                                    courseNames_required.add(v[3])
                                } else {
                                    courseNames_no_required.add(v[3])
                                }

                                if (+v[5] === 0 && +v[6] === 0) {
                                    //删除没有成绩或学分的课程
                                    item.splice(i, 1)
                                    i--
                                } else if (temp.has(v[3])) {
                                    //删除同一学期同名课程并取分数高的
                                    if (i > 0 && v[5] > item[i - 1][5]) {
                                        item[i - 1][5] = v[5]
                                        item[i - 1][6] = v[6]
                                    }
                                    item.splice(i, 1)
                                    i--
                                } else {
                                    temp.add(v[3])
                                }
                            }
                        })
                    })

                    this.courseNames_required = [...courseNames_required]
                    this.courseNames_no_required = [...courseNames_no_required]
                    // console.log(this.courseNames_required)
                    // console.log(this.courseNames_no_required)
                    // debugger
                    let courseNames = [
                        ...courseNames_required,
                        ...courseNames_no_required,
                    ]
                    for (const value of courseNames) {
                        this.courseNameObj[value] = value
                    }
                    temp.forEach(obj => {
                        v0.forEach(arr => {
                            if (
                                arr.some(elem =>
                                    elem.some(ele => ele.includes(obj.姓名)),
                                )
                            ) {
                                obj.学期成绩总表 = arr
                            }
                        })
                    })
                    // console.log(temp)
                    // debugger

                    // console.log(v[1].value)
                    // debugger
                    //将temp汇总的数据交给学籍信息收集表
                    v[1].value.forEach(obj1 => {
                        temp.forEach(obj2 => {
                            if (obj1.学号 == obj2.学号) {
                                obj1.学年评语 = obj2.学年评语
                                obj1.学期成绩总表 = obj2.学期成绩总表
                                //处理中职班模板中几个时间
                                if (this.pick === 'low') {
                                    obj1.入学时间 = `${end - 3}年6月30日`
                                    obj1.毕业时间 = `${end}年6月30日`
                                    obj1.个人简历1 = `${
                                        end - 3
                                    }年6月~${end}年6月`
                                    obj1.个人简历2 = `${end - 6}年6月~${
                                        end - 3
                                    }年6月`
                                    obj1.学年1 = `${end - 3}/${end - 2}`
                                    obj1.报到1 = `${end - 3}年9月7日`
                                    obj1.报到2 = `${end - 2}年1月14日`
                                    obj1.学年2 = `${end - 2}/${end - 1}`
                                    obj1.报到3 = `${end - 2}年9月7日`
                                    obj1.报到4 = `${end - 1}年1月14日`
                                    obj1.学年3 = `${end - 1}/${end}`
                                    obj1.报到5 = `${end - 1}年9月7日`
                                    obj1.报到6 = `${end}年1月14日`
                                }
                            }
                        })
                    })
                    // console.log(v[1].value)
                    // debugger
                    this.messages = v[1].value
                    // localStorage.setItem('messages', JSON.stringify(v[1].value))
                    // sessionStorage.setItem('messages', JSON.stringify(v[1].value))
                })
                return
            }

            if (
                this.pick === 'high' &&
                !(
                    file8 &&
                    file9 &&
                    file10 &&
                    file11 &&
                    file12 &&
                    file13 &&
                    file14
                )
            ) {
                alert(
                    `如果您想制作高职学籍表,请上传必需的学期成绩总表、学籍信息收集表、5个学年的评语表`,
                )
                return
            }
            if (
                this.pick === 'low' &&
                !(file8 && file9 && file10 && file11 && file12)
            ) {
                alert(
                    `如果您想制作中职学籍表,请上传必需的学期成绩总表、学籍信息收集表、3个学年的评语表`,
                )
                return
            }
        },

        //获取相关整合数据
        fetchMessages() {
            // this.messages = JSON.parse(localStorage.getItem('messages'))
            // this.messages = JSON.parse(sessionStorage.getItem('messages'))
            console.log(this.messages[0])
            // console.log(this.messages[0].学期成绩总表)
            // debugger
            if (sessionStorage.getItem('courseNameObj2')) {
                this.courseNameObj = JSON.parse(
                    sessionStorage.getItem('courseNameObj2'),
                )
            }
            // console.log(this.courseNameObj)
            // console.log(this.courseNames_required)
            // console.log(this.courseNames_no_required)
            this.info = this.messages
                ? ' ू(ʚ̴̶̷́ .̠ ʚ̴̶̷̥̀ ू)获取整合数据成功~'
                : '(╯>д<)╯⁽˙³˙⁾获取整合数据失败,请回到第一步选取或者拖入相关Excel表'
            // show.style.visibility = 'visible'
            // show.style.display = 'block'
        },
        handle() {
            //https://cn.vuejs.org/api/reactivity-advanced.html#toraw
            sessionStorage.setItem(
                'courseNameObj2',
                JSON.stringify(Vue.toRaw(this.courseNameObj)),
            )
            this.value = this.value === 'block' ? 'none' : 'block'
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
        generate(msg) {
            // console.log(msg)
            const str = this.pick === 'high' ? 'high2.docx' : 'low2.docx'
            const courseNameObj = this.courseNameObj
            const courseNames_required = this.courseNames_required
            const courseNames_no_required = this.courseNames_no_required
            const pick = this.pick
            PizZipUtils.getBinaryContent(str, function (error, content) {
                // console.log(this.courseNameObj)//回调函数内部访问不到this
                //抛出读取错误
                if (error) {
                    throw error
                }

                const zip = new PizZip(content)
                //https://docxtemplater.com/docs/configuration/#paragraphloop
                //https://docxtemplater.com/docs/configuration/#linebreaks
                const doc = new docxtemplater(zip, {
                    paragraphLoop: true,
                    linebreaks: true,
                    //https://juejin.cn/post/7094139413248081928
                    nullGetter: function () {
                        return ''
                    },
                })

                //处理学期成绩总表
                const temp = msg.学期成绩总表 //某人的10个学期成绩
                // console.log(temp)
                // debugger
                const record = {}
                if (pick === 'high') {
                    temp?.forEach((semester, index) => {
                        //吴大帅没有考试成绩
                        semester.forEach((v, i) => {
                            record[`course${index + 1}_${i + 1}`] =
                                v[3].length <= 10 ? v[3] : courseNameObj[v[3]] //课程名称
                            record[`k${index + 1}_${i + 1}`] =
                                v[4] === '必修课'
                                    ? '必修'
                                    : v[4] === '实习实训课'
                                    ? '实训'
                                    : v[4] === '通修课'
                                    ? '通修'
                                    : '' //类别

                            //v[5]是个字符串,可能是'96.69'、'67'、'56/68'
                            // record[`r${index + 1}_${i + 1}`] = Math.round(v[5]) || ''//成绩,有出现小数割裂表格的情况所以取整
                            const it = v[5].indexOf('/') //i=-1 ~i=0
                            record[`r${index + 1}_${i + 1}`] =
                                Math.round(~it ? v[5].slice(it + 1) : v[5]) ||
                                ''
                            record[`c${index + 1}_${i + 1}`] = v[6] || '' //学分
                        })
                    })
                } else {
                    courseNames_required.sort((a, b) => a.localeCompare(b))
                    for (let i = 1; i <= 28; i++) {
                        record[`course${i}`] = courseNames_required[i - 1] || ''
                    }
                    courseNames_no_required.sort((a, b) => a.localeCompare(b))
                    for (let i = 29; i <= 34; i++) {
                        record[`course${i}`] =
                            courseNames_no_required[i - 29] || ''
                    }
                    const courseNames = [
                        ...courseNames_required,
                        ...courseNames_no_required,
                    ]
                    // console.log(courseNames)
                    // console.log(record)
                    // debugger
                    temp?.forEach((semester, index) => {
                        //吴大帅没有考试成绩
                        semester.forEach(v => {
                            //v是这样滴['2021-2022', '1', '杨佳美', '钢琴基础', '必修课', '64', '2']
                            const j = courseNames.indexOf(v[3])
                            //v[5]是个字符串,可能是'96.69'、'67'、'56/68'
                            //成绩,有出现小数割裂表格的情况所以取整
                            const it = v[5].indexOf('/') //i=-1 ~i=0
                            // record[`k${index + 1}_${j + 1}`] = ~j ? Math.round(~it ? v[5].slice(it + 1) : v[5]) : ''
                            let temp
                            if (j !== -1) {
                                if (it !== -1) {
                                    // temp = Math.round(~it ? v[5].slice(it + 1) : v[5])
                                    temp = Math.round(v[5].slice(it + 1))
                                } else if (Number.isNaN(+v[5])) {
                                    temp = v[5]
                                } else {
                                    temp = Math.round(v[5])
                                }
                            } else {
                                temp = ''
                            }
                            record[`k${index + 1}_${j + 1}`] = temp
                        })
                    })
                    // console.log(record)
                    // debugger
                }
                // console.log(record)
                // debugger

                //要填充的数据
                doc.setData({
                    ...msg,
                    grade: msg.班级名称.slice(0, 2),
                    class: msg.班级名称.slice(0, 4),
                    year1: new Date().getFullYear(), //'20' + (+msg.班级名称.slice(0, 2) + 5)
                    year2: new Date().getFullYear() - 1,
                    year3: new Date().getFullYear() - 2,
                    year4: new Date().getFullYear() - 3,
                    year5: new Date().getFullYear() - 4,

                    ...msg.学年评语,

                    ...record,
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
                saveAs(out, `${msg.班级名称}-${msg.学号}-${msg.姓名}.docx`)
            })
        },
    },

    watch: {
        n(newValue) {
            if (this.n === this.messages.length) {
                alert(`为您节省下来的每一秒都会使我快乐!`)
                return
            }
            const message = this.messages[newValue]
            this.generate(message)
        },
        pick: {
            handler: function (newValue, oldValue) {
                console.log(this.pick)
                console.log(window.devicePixelRatio)
                // if (window.devicePixelRatio != 1.5) {
                //     document.body.style.zoom = 1.5
                // }
            },
            immediate: true,
        },
        // courseNameObj: {
        //     handler: function (newValue, oldValue) {
        //         // console.log(newValue === oldValue)//true
        //         // console.log(newValue.x)
        //         console.log(newValue)
        //     },
        //     immediate: true,
        //     //https://cn.vuejs.org/guide/essentials/watchers.html#deep-watchers
        //     deep: true,
        // }
    },
}
