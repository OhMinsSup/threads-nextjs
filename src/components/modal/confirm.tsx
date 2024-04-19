'use client';

import React from 'react';

import type { ConfirmModalProps } from './confirm-modal';
import type { ConfigUpdate, ModalFuncProps } from './types';

import {
  render as reactRender,
  unmount as reactUnmount,
} from '~/libs/react/render';
import ConfirmModal from './confirm-modal';
import destroyFns from './destoryFns';

function ConfirmDialogWrapper(props: ConfirmModalProps) {
  return <ConfirmModal {...props} />;
}

export default function confirm(config: ModalFuncProps) {
  const container = document.createDocumentFragment();
  let currentConfig = { ...config, close, open: true } as ModalFuncProps;
  let timeoutId: ReturnType<typeof setTimeout>;

  function destroy(...args: any[]) {
    const triggerCancel = args.some((param) => param?.triggerCancel);
    if (config.onCancel && triggerCancel) {
      config.onCancel(() => {}, ...args.slice(1));
    }
    for (let i = 0; i < destroyFns.length; i++) {
      const fn = destroyFns.at(i);

      if (fn === close) {
        destroyFns.splice(i, 1);
        break;
      }
    }

    reactUnmount(container);
  }

  function render(props: any) {
    clearTimeout(timeoutId);

    /**
     * Sync render blocks React event. Let's make this async.
     */
    timeoutId = setTimeout(() => {
      const dom = <ConfirmDialogWrapper {...props} />;

      reactRender(dom, container);
    });
  }

  function close(...args: any[]) {
    currentConfig = {
      ...currentConfig,
      open: false,
      afterClose: () => {
        if (typeof config.afterClose === 'function') {
          config.afterClose();
        }

        // @ts-expect-error - apply arguments to destroy function
        destroy.apply(this, args);
      },
    };

    render(currentConfig);
  }

  function update(configUpdate: ConfigUpdate) {
    if (typeof configUpdate === 'function') {
      currentConfig = configUpdate(currentConfig);
    } else {
      currentConfig = {
        ...currentConfig,
        ...configUpdate,
      };
    }
    render(currentConfig);
  }

  render(currentConfig);

  destroyFns.push(close);

  return {
    destroy,
    update,
  };
}

export function withModal(props: ModalFuncProps): ModalFuncProps {
  return {
    type: 'confirm',
    okText: '확인',
    cancelText: '취소',
    ...props,
  };
}
