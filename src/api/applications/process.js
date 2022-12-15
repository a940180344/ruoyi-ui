import request from '@/utils/request'

// 进程字典
export function dictionaryApplication() {
  return request({
    url: '/Approval/dictionary',
    method: 'get'
  })
}

export function getAllUserApp() {
  return request({
    url: '/Approval/getAllUserApp',
    method: 'get'
  })
}
//根据id获取进程
export function getByid(id) {
  return request({
    url: '/Approval/get',
    method: 'get',
    params:{id}
  })
}

//根据name获取进程
export function getByName(name) {
  return request({
    url: '/Approval/getName',
    method: 'get',
    params:{name}
  })
}
//修改进程
export function updataApplication(data) {
  return request({
    url: '/Approval/updata',
    method: 'post',
    data: data
  })
}

//教务管理字典
export function roleJiaoWu() {
  return request({
    url: '/roleUser/procss',
    method: 'get',
  })
}


// 个人申请列表
export function studioAppInfo() {
  return request({
    url: '/studio/application/info',
    method: 'get',

  })
}
