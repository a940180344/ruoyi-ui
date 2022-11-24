import request from '@/utils/request'

// 查询naxin列表
export function listNaxin(data) {
  return request({
    url: '/studio/naxin/List',
    method: 'Post',
    data: data
  })
}

// 新增naxin
export function addNaxin(data) {
  return request({
    url: '/studio/naxin/add',
    method: 'post',
    data: data
  })
}

// 通过审批信息
export function pass(data) {
  return request({
    url: '/studio/naxin/pass',
    method: 'post',
    data: data
  })
}

// 通过驳回审批信息
export function overrule(data) {
  return request({
    url: '/studio/naxin/overrule',
    method: 'post',
    data: data
  })
}

// 拒绝审批信息
export function refuse(data) {
  return request({
    url: '/studio/naxin/refuse',
    method: 'post',
    data: data
  })
}
