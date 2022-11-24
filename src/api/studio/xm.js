import request from '@/utils/request'

// 查询新增项目列表
export function listXm(query) {
  return request({
    url: '/studio/xm/list',
    method: 'get',
    params: query
  })
}

// 查询新增项目详细
export function getXm(id) {
  return request({
    url: '/studio/xm/' + id,
    method: 'get'
  })
}

// 新增新增项目
export function addXm(data) {
  return request({
    url: '/studio/xm',
    method: 'post',
    data: data
  })
}

// 修改新增项目
export function updateXm(data) {
  return request({
    url: '/studio/xm',
    method: 'put',
    data: data
  })
}

// 删除新增项目
export function delXm(id) {
  return request({
    url: '/studio/xm/' + id,
    method: 'delete'
  })
}
