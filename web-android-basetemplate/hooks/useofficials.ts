import { useCallback, useEffect, useState } from 'react';
import officialService from '../services/official/official.service';
import { Official } from '../services/official/official.type';

export const useOfficials = (options?: {
  lazy?: boolean;
  isActive?: boolean;
  search?: string;
  page?: number;
  rowsPerPage?: number;
}) => {
  const [officials, setOfficials] = useState<Official[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    isActive,
    search,
    page = 0,
    rowsPerPage = 10,
  } = options || {};

  const loadOfficials = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      /*
       * Backend supports:
       *
       * page
       * page_size
       * is_active
       *
       * The Senior UI table performs its own
       * search/filter/pagination, so fetch a
       * larger dataset here.
       */
      const params: Record<string, any> = {
        page: 1,
        page_size: 100,
      };

      if (isActive !== undefined) {
        params.is_active = isActive;
      }

      /*
       * Search is handled by OfficialsTable.
       * Therefore we intentionally do not send
       * `search` to the current backend.
       */

      console.log('========== LOADING OFFICIALS ==========');
      console.log('OFFICIAL PARAMS:', params);

      const response = await officialService.getOfficials(params);

      console.log('========== OFFICIAL API RESPONSE ==========');
      console.log('OFFICIAL RESPONSE:', response);
      console.log('OFFICIAL RESPONSE DATA:', response?.data);
      console.log('============================================');

      /*
       * CURRENT BACKEND RESPONSE:
       *
       * {
       *   message: "...",
       *   data: {
       *     items: [...],
       *     total: 6,
       *     page: 1,
       *     page_size: 100
       *   }
       * }
       */
      const items = Array.isArray(response?.data?.items)
        ? response.data.items
        : Array.isArray(response?.items)
          ? response.items
          : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response)
              ? response
              : [];

      const serverTotal =
        typeof response?.data?.total === 'number'
          ? response.data.total
          : typeof response?.total === 'number'
            ? response.total
            : items.length;

      /*
       * Normalize backend fields so the existing
       * Senior UI components continue to work.
       */
      const normalizedOfficials: Official[] = items.map(
        (official: any) => {
          const officialName =
            official?.official_name ||
            official?.name ||
            `${official?.first_name || ''} ${official?.last_name || ''}`.trim();

          const nameParts = officialName
            .trim()
            .split(/\s+/)
            .filter(Boolean);

          const firstName =
            official?.first_name ||
            nameParts[0] ||
            '';

          const lastName =
            official?.last_name ||
            nameParts.slice(1).join(' ') ||
            '';

          const mobile =
            official?.mobile ||
            official?.phone_no ||
            official?.phone ||
            '';

          return {
            ...official,

            /*
             * Current backend fields
             */
            official_name: officialName,
            mobile,

            /*
             * Compatibility fields used by
             * existing Senior UI
             */
            first_name: firstName,
            last_name: lastName,
            phone_no: mobile,

            email: official?.email || '',
            state: official?.state || '',
            city: official?.city || '',
            gender: official?.gender || '',
            role_title:
              official?.role_title ||
              official?.role ||
              'Official',

            dob:
              official?.dob ||
              official?.date_of_birth ||
              '',

            date_of_birth:
              official?.date_of_birth ||
              official?.dob ||
              '',

            is_active:
              official?.is_active === undefined
                ? true
                : official.is_active,
          } as Official;
        }
      );

      console.log(
        'NORMALIZED OFFICIALS:',
        normalizedOfficials
      );

      console.log(
        'NORMALIZED OFFICIAL COUNT:',
        normalizedOfficials.length
      );

      setOfficials(normalizedOfficials);
      setTotal(serverTotal);

    } catch (err: any) {
      console.error(
        'FETCH OFFICIALS ERROR:',
        err
      );

      setOfficials([]);
      setTotal(0);

      setError(
        err?.message ||
        'Failed to fetch officials'
      );
    } finally {
      setLoading(false);
    }
  }, [isActive]);

  useEffect(() => {
    if (options?.lazy) {
      return;
    }

    loadOfficials();
  }, [loadOfficials, options?.lazy]);

  return {
    officials,
    total,
    loading,
    error,
    reload: loadOfficials,
  };
};