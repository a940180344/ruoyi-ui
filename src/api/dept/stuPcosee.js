import request from '@/utils/request'

// 查询studio列表
export function listStio(data) {
  return request({
    url: '/studio/application/List',
    method: 'post',
    data: data
  })
}

// 查询studio详细
export function getStudioList(id) {
  return request({
    url: '/studio/application/info',
    method: 'get'
  })
}

// 新增studio
export function addStio(data) {
  return request({
    url: '/studio/application/add',
    method: 'post',
    data: data
  })
}

// 通过审批信息
export function pass(data) {
  return request({
    url: '/studio/application/pass',
    method: 'post',
    data: data
  })
}

// 通过驳回审批信息
export function overrule(data) {
  return request({
    url: '/studio/application/overrule',
    method: 'post',
    data: data
  })
}

// 拒绝审批信息
export function refuse(data) {
  return request({
    url: '/studio/application/refuse',
    method: 'post',
    data: data
  })
}


// 通过审批信息
export function Pass(data) {
  return request({
    url: '/studio/application/pass',
    method: 'post',
    data: data
  })
}


// // 修改studio
// export function updateStio(data) {
//   return request({
//     url: '/studio/application/',
//     method: 'put',
//     data: data
//   })
// }

// // 删除studio
// export function delStio(id) {
//   return request({
//     url: '/studio/stio/' + id,
//     method: 'delete'
//   })
// }
